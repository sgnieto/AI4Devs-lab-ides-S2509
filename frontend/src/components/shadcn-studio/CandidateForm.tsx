import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { createCandidateRequest } from '@lib/api'
import { useAutocomplete, type AutocompleteItem } from '@hooks/use-autocomplete'

export default function CandidateForm() {
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [education, setEducation] = React.useState('')
  const [workExperience, setWorkExperience] = React.useState('')
  const [cvFile, setCvFile] = React.useState<File | null>(null)

  const edu = useAutocomplete('educacion')
  const exp = useAutocomplete('experienciaLaboral')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const form = new FormData()
      form.append('firstName', firstName)
      form.append('lastName', lastName)
      form.append('email', email)
      if (phone) form.append('phone', phone)
      if (address) form.append('address', address)
      if (education) form.append('educacion', education)
      if (workExperience) form.append('experienciaLaboral', workExperience)
      if (cvFile) form.append('cv', cvFile)
      await createCandidateRequest(form)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) { setCvFile(null); return }
    const ok = ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)
    if (!ok) { setError('Tipo de archivo no permitido'); e.target.value=''; return }
    if (f.size > 5 * 1024 * 1024) { setError('Archivo supera 5 MB'); e.target.value=''; return }
    setError(null)
    setCvFile(f)
  }

  return (
    <Card className="p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Añadir candidato</h2>
      {error && <div role="alert" className="mb-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required maxLength={100} />
        </div>
        <div>
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required maxLength={100} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={200} />
        </div>

        <div>
          <Label htmlFor="education">Educación</Label>
          <Input
            id="education"
            value={education}
            onChange={(e) => { setEducation(e.target.value); edu.query(e.target.value) }}
            aria-autocomplete="list"
            aria-controls="education-list"
          />
          {edu.items.length > 0 && (
            <ul id="education-list" role="listbox" className="mt-1 border rounded">
              {edu.items.map((it: AutocompleteItem) => (
                <li 
                  key={it.value} 
                  role="option" 
                  aria-selected={education === it.value}
                  className="px-2 py-1 cursor-pointer hover:bg-accent" 
                  onClick={() => setEducation(it.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setEducation(it.value)
                    }
                  }}
                  tabIndex={0}
                >
                  {it.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Label htmlFor="workExperience">Experiencia laboral</Label>
          <Input
            id="workExperience"
            value={workExperience}
            onChange={(e) => { setWorkExperience(e.target.value); exp.query(e.target.value) }}
            aria-autocomplete="list"
            aria-controls="experience-list"
          />
          {exp.items.length > 0 && (
            <ul id="experience-list" role="listbox" className="mt-1 border rounded">
              {exp.items.map((it: AutocompleteItem) => (
                <li 
                  key={it.value} 
                  role="option" 
                  aria-selected={workExperience === it.value}
                  className="px-2 py-1 cursor-pointer hover:bg-accent" 
                  onClick={() => setWorkExperience(it.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setWorkExperience(it.value)
                    }
                  }}
                  tabIndex={0}
                >
                  {it.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Label htmlFor="cv">CV (PDF o DOCX, ≤5 MB)</Label>
          <Input id="cv" type="file" accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFileChange} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Cancelar</Button>
        </div>
      </form>
    </Card>
  )
}


