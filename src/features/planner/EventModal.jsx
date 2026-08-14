import { useState } from 'react'
import TagInput from './TagInput'

let buttonKeySeq = 0
function newButtonId() {
  buttonKeySeq += 1
  return `btn-${Date.now()}-${buttonKeySeq}`
}

function normalizeUrl(url) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export default function EventModal({ mode, initialDate, event, allTags, onCreateTag, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(event?.title || '')
  const [eventDate, setEventDate] = useState(event?.event_date || initialDate)
  const [endDate, setEndDate] = useState(event?.end_date || event?.event_date || initialDate)
  const [notes, setNotes] = useState(event?.notes || '')
  const [tagIds, setTagIds] = useState(event?.tag_ids || [])
  const [buttons, setButtons] = useState(
    event?.buttons?.length ? event.buttons.map((b) => ({ ...b, id: b.id || newButtonId() })) : []
  )
  const [saving, setSaving] = useState(false)

  const addButton = () => setButtons((b) => [...b, { id: newButtonId(), label: '', url: '' }])
  const updateButton = (id, field, value) =>
    setButtons((b) => b.map((btn) => (btn.id === id ? { ...btn, [field]: value } : btn)))
  const removeButton = (id) => setButtons((b) => b.filter((btn) => btn.id !== id))

  const handleStartChange = (value) => {
    setEventDate(value)
    if (endDate < value) setEndDate(value)
  }

  const handleSave = async () => {
    if (!title.trim() || !eventDate) return
    setSaving(true)
    const cleanButtons = buttons
      .filter((b) => b.label.trim() && b.url.trim())
      .map((b) => ({ id: b.id, label: b.label.trim(), url: normalizeUrl(b.url) }))

    await onSave({
      title: title.trim(),
      event_date: eventDate,
      end_date: endDate && endDate >= eventDate ? endDate : eventDate,
      notes: notes.trim() || null,
      tag_ids: tagIds,
      buttons: cleanButtons,
    })
    setSaving(false)
  }

  return (
    <div className="pl-modal-overlay" onMouseDown={onClose}>
      <div className="pl-modal" onMouseDown={(e) => e.stopPropagation()}>
        <h2>{mode === 'edit' ? 'Editar evento' : 'Novo evento'}</h2>

        <div className="pl-field">
          <label htmlFor="pl-event-title">Título</label>
          <input
            id="pl-event-title"
            type="text"
            className="pl-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Disparo de e-mail, evento, prazo final..."
            autoFocus
          />
        </div>

        <div className="pl-field-row">
          <div className="pl-field">
            <label htmlFor="pl-event-date">Início</label>
            <input
              id="pl-event-date"
              type="date"
              value={eventDate}
              onChange={(e) => handleStartChange(e.target.value)}
            />
          </div>
          <div className="pl-field">
            <label htmlFor="pl-event-end-date">Fim (opcional)</label>
            <input
              id="pl-event-end-date"
              type="date"
              value={endDate}
              min={eventDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="pl-field">
          <label>Tags</label>
          <TagInput
            allTags={allTags}
            selectedTagIds={tagIds}
            onChange={setTagIds}
            onCreateTag={onCreateTag}
          />
        </div>

        <div className="pl-field">
          <label>Botões (links)</label>
          {buttons.map((btn) => (
            <div className="pl-button-row" key={btn.id}>
              <input
                type="text"
                placeholder="Nome do botão"
                value={btn.label}
                onChange={(e) => updateButton(btn.id, 'label', e.target.value)}
              />
              <input
                type="url"
                placeholder="https://..."
                value={btn.url}
                onChange={(e) => updateButton(btn.id, 'url', e.target.value)}
              />
              <button
                type="button"
                className="pl-btn-remove"
                onClick={() => removeButton(btn.id)}
                aria-label="Remover botão"
              >
                &times;
              </button>
            </div>
          ))}
          <button type="button" className="pl-add-button-link" onClick={addButton}>
            + Adicionar botão
          </button>
        </div>

        <div className="pl-field">
          <label htmlFor="pl-event-notes">Observações</label>
          <textarea
            id="pl-event-notes"
            className="pl-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Direcionamentos, contexto adicional..."
          />
        </div>

        <div className="pl-modal-actions">
          <div>
            {mode === 'edit' && (
              <button type="button" className="pl-btn-danger-text" onClick={onDelete}>
                Excluir evento
              </button>
            )}
          </div>
          <div className="pl-modal-actions-right">
            <button type="button" className="pl-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="pl-btn-primary"
              onClick={handleSave}
              disabled={saving || !title.trim() || !eventDate}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
