import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useSupabaseUser } from '../../lib/useSupabaseUser'
import { colorForTagIndex, normalizeTagName } from '../../lib/tagUtils'
import EventModal from './EventModal'
import './planner.css'

const ZOOM_LEVELS = [3, 6, 12, 24, 48] // pixels per day, from year-overview to day-precise
const ZOOM_LABELS = ['Ano', 'Semestre', 'Mês', 'Semana', 'Dia']
const DEFAULT_ZOOM_INDEX = 2
const MONTH_LABELS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

const RANGE_START = new Date(Date.UTC(new Date().getFullYear() - 2, 0, 1))
const RANGE_END = new Date(Date.UTC(new Date().getFullYear() + 3, 11, 31))
const TOTAL_DAYS = Math.round((RANGE_END - RANGE_START) / 86400000)

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function dayIndexFromDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return Math.round((Date.UTC(y, m - 1, d) - RANGE_START) / 86400000)
}

function dateStrFromDayIndex(idx) {
  const dt = new Date(RANGE_START.getTime() + idx * 86400000)
  return dt.toISOString().slice(0, 10)
}

function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function applyRealtimeChange(setList, payload) {
  setList((prev) => {
    if (payload.eventType === 'DELETE') return prev.filter((r) => r.id !== payload.old.id)
    const exists = prev.some((r) => r.id === payload.new.id)
    if (exists) return prev.map((r) => (r.id === payload.new.id ? payload.new : r))
    return [...prev, payload.new]
  })
}

export default function Planner() {
  useSupabaseUser()

  const [tags, setTags] = useState([])
  const [events, setEvents] = useState([])
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX)
  const [activeEventId, setActiveEventId] = useState(null)
  const [modalState, setModalState] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const scrollRef = useRef(null)
  const dragInfo = useRef({ startX: 0, startScrollLeft: 0, moved: false })

  const pxPerDay = ZOOM_LEVELS[zoomIndex]
  const trackWidth = TOTAL_DAYS * pxPerDay
  const showDayTicks = pxPerDay >= 20

  useEffect(() => {
    const load = async () => {
      const [{ data: tagsData }, { data: eventsData }] = await Promise.all([
        supabase.from('planner_tags').select('*').order('created_at'),
        supabase.from('planner_events').select('*').order('event_date'),
      ])
      setTags(tagsData || [])
      setEvents(eventsData || [])
    }
    load()

    const channel = supabase
      .channel('planner_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'planner_events' }, (payload) =>
        applyRealtimeChange(setEvents, payload)
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'planner_tags' }, (payload) =>
        applyRealtimeChange(setTags, payload)
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    if (!scrollRef.current) return
    const idx = dayIndexFromDate(todayStr())
    scrollRef.current.scrollLeft = idx * pxPerDay - scrollRef.current.clientWidth / 2
    // only on first mount, at the default zoom
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getOrCreateTag = useCallback(
    async (rawName) => {
      const name = normalizeTagName(rawName)
      if (!name) return null
      const existing = tags.find((t) => t.name === name)
      if (existing) return existing

      const color = colorForTagIndex(tags.length)
      const { data, error } = await supabase.from('planner_tags').insert({ name, color }).select().single()

      if (error) {
        const { data: retry } = await supabase.from('planner_tags').select('*').eq('name', name).single()
        if (retry) {
          setTags((prev) => (prev.some((t) => t.id === retry.id) ? prev : [...prev, retry]))
          return retry
        }
        console.error('Erro ao criar tag:', error)
        return null
      }

      setTags((prev) => (prev.some((t) => t.id === data.id) ? prev : [...prev, data]))
      return data
    },
    [tags]
  )

  const saveEvent = async (payload) => {
    if (modalState?.mode === 'edit') {
      const { data, error } = await supabase
        .from('planner_events')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', modalState.event.id)
        .select()
        .single()
      if (error) {
        window.alert(`Erro ao salvar evento: ${error.message}`)
        return
      }
      setEvents((prev) => prev.map((e) => (e.id === data.id ? data : e)))
    } else {
      const { data, error } = await supabase.from('planner_events').insert(payload).select().single()
      if (error) {
        window.alert(`Erro ao criar evento: ${error.message}`)
        return
      }
      setEvents((prev) => (prev.some((e) => e.id === data.id) ? prev : [...prev, data]))
    }
    setModalState(null)
  }

  const deleteEvent = async () => {
    if (modalState?.mode !== 'edit') return
    const id = modalState.event.id
    const { error } = await supabase.from('planner_events').delete().eq('id', id)
    if (error) {
      window.alert(`Erro ao excluir evento: ${error.message}`)
      return
    }
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setModalState(null)
    setActiveEventId(null)
  }

  const changeZoom = (delta) => {
    setZoomIndex((prevIndex) => {
      const nextIndex = Math.min(ZOOM_LEVELS.length - 1, Math.max(0, prevIndex + delta))
      if (nextIndex === prevIndex || !scrollRef.current) return nextIndex
      const container = scrollRef.current
      const oldPx = ZOOM_LEVELS[prevIndex]
      const newPx = ZOOM_LEVELS[nextIndex]
      const centerDay = (container.scrollLeft + container.clientWidth / 2) / oldPx
      requestAnimationFrame(() => {
        container.scrollLeft = centerDay * newPx - container.clientWidth / 2
      })
      return nextIndex
    })
  }

  const goToToday = () => {
    if (!scrollRef.current) return
    const idx = dayIndexFromDate(todayStr())
    scrollRef.current.scrollTo({ left: idx * pxPerDay - scrollRef.current.clientWidth / 2, behavior: 'smooth' })
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !scrollRef.current) return
    dragInfo.current = { startX: e.clientX, startScrollLeft: scrollRef.current.scrollLeft, moved: false }
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    const dx = e.clientX - dragInfo.current.startX
    if (Math.abs(dx) > 4) dragInfo.current.moved = true
    scrollRef.current.scrollLeft = dragInfo.current.startScrollLeft - dx
  }

  const endDrag = () => setIsDragging(false)

  const handleTrackRelease = (e) => {
    endDrag()
    if (dragInfo.current.moved) return
    if (e.target.closest('.pl-event') || e.target.closest('.pl-event-card')) return
    const rect = scrollRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + scrollRef.current.scrollLeft
    const dayIdx = Math.floor(x / pxPerDay)
    setActiveEventId(null)
    setModalState({ mode: 'create', date: dateStrFromDayIndex(dayIdx) })
  }

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      changeZoom(e.deltaY < 0 ? 1 : -1)
      return
    }
    if (scrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollRef.current.scrollLeft += e.deltaY
    }
  }

  const monthTicks = useMemo(() => {
    const ticks = []
    let y = RANGE_START.getUTCFullYear()
    let m = 0
    while (true) {
      const dt = new Date(Date.UTC(y, m, 1))
      if (dt > RANGE_END) break
      const idx = Math.round((dt - RANGE_START) / 86400000)
      ticks.push({ key: `${y}-${m}`, left: idx * pxPerDay, isYear: m === 0, label: MONTH_LABELS[m], year: y })
      m += 1
      if (m === 12) {
        m = 0
        y += 1
      }
    }
    return ticks
  }, [pxPerDay])

  const dayTicks = useMemo(() => {
    if (!showDayTicks) return []
    return Array.from({ length: TOTAL_DAYS + 1 }, (_, i) => i)
  }, [showDayTicks])

  const tagById = useMemo(() => {
    const m = new Map()
    tags.forEach((t) => m.set(t.id, t))
    return m
  }, [tags])

  const todayIdx = dayIndexFromDate(todayStr())

  return (
    <div className="planner-root">
      <header className="pl-header">
        <div className="pl-header-left">
          <h1 className="pl-title">Planner</h1>
          <a href="/" className="pl-back-link">
            &larr; Cronograma
          </a>
        </div>
        <div className="pl-header-right">
          <button type="button" className="pl-btn" onClick={goToToday}>
            Hoje
          </button>
          <div className="pl-zoom-group">
            <button
              type="button"
              className="pl-zoom-btn"
              onClick={() => changeZoom(-1)}
              disabled={zoomIndex === 0}
              aria-label="Diminuir zoom"
            >
              &minus;
            </button>
            <span className="pl-zoom-label">{ZOOM_LABELS[zoomIndex]}</span>
            <button
              type="button"
              className="pl-zoom-btn"
              onClick={() => changeZoom(1)}
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
              aria-label="Aumentar zoom"
            >
              +
            </button>
          </div>
        </div>
      </header>

      <div
        className={`pl-track-scroll${isDragging ? ' dragging' : ''}`}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleTrackRelease}
        onMouseLeave={endDrag}
        onWheel={handleWheel}
      >
        <div className="pl-track" style={{ width: trackWidth }}>
          <div className="pl-spine" />

          {monthTicks.map((t) => (
            <Fragment key={t.key}>
              <div className={`pl-tick ${t.isYear ? 'pl-tick-year' : 'pl-tick-month'}`} style={{ left: t.left }} />
              {t.isYear ? (
                <div className="pl-label-year" style={{ left: t.left }}>
                  {t.year}
                </div>
              ) : (
                <div className="pl-label-month" style={{ left: t.left }}>
                  {t.label}
                </div>
              )}
            </Fragment>
          ))}

          {showDayTicks &&
            dayTicks.map((idx) => <div key={idx} className="pl-tick pl-tick-day" style={{ left: idx * pxPerDay }} />)}

          <div className="pl-today" style={{ left: todayIdx * pxPerDay }} />
          <div className="pl-today-pill" style={{ left: todayIdx * pxPerDay }}>
            HOJE
          </div>

          {events.map((ev) => {
            const idx = dayIndexFromDate(ev.event_date)
            const evTags = (ev.tag_ids || []).map((id) => tagById.get(id)).filter(Boolean)
            const color = evTags[0]?.color || '#8b94a7'
            const isActive = activeEventId === ev.id
            return (
              <Fragment key={ev.id}>
                <div
                  className={`pl-event${isActive ? ' active' : ''}`}
                  style={{ left: idx * pxPerDay, background: color, boxShadow: `0 0 10px ${color}99` }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Evento: ${ev.title}, ${formatDateLabel(ev.event_date)}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveEventId(isActive ? null : ev.id)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveEventId(isActive ? null : ev.id)
                    }
                  }}
                />
                {isActive && (
                  <div className="pl-event-card" style={{ left: idx * pxPerDay }}>
                    <div className="pl-event-date">{formatDateLabel(ev.event_date)}</div>
                    <div className="pl-event-title">{ev.title}</div>
                    {evTags.length > 0 && (
                      <div className="pl-tag-row">
                        {evTags.map((t) => (
                          <span
                            key={t.id}
                            className="pl-tag-chip"
                            style={{ background: `${t.color}26`, color: t.color, border: `1px solid ${t.color}55` }}
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {ev.buttons?.length > 0 && (
                      <div className="pl-btn-row">
                        {ev.buttons.map((b) => (
                          <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer" className="pl-link-chip">
                            {b.label} &#8599;
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="pl-event-actions">
                      <button type="button" onClick={() => setModalState({ mode: 'edit', event: ev })}>
                        Editar
                      </button>
                    </div>
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>
      </div>

      <div className="pl-hint">
        Clique em qualquer ponto da linha do tempo para criar um evento &middot; Ctrl+scroll ou os botões +/&minus; para zoom
      </div>

      {modalState && (
        <EventModal
          mode={modalState.mode}
          initialDate={modalState.date}
          event={modalState.event}
          allTags={tags}
          onCreateTag={getOrCreateTag}
          onSave={saveEvent}
          onDelete={deleteEvent}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}
