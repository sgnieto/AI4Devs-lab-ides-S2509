/* eslint-disable no-console */
import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

type Command = 'create' | 'list' | 'role' | 'reset-password'

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (!next || next.startsWith('--')) {
        args[key] = true
      } else {
        args[key] = next
        i++
      }
    }
  }
  return args
}

function generatePassword(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]:;<>?,.'
  let out = ''
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function assertPasswordPolicy(pw: string) {
  if (!pw || pw.length < 8) throw new Error('PASSWORD_TOO_SHORT')
}

function dumpNonProdUser(envName: string, data: any) {
  if (envName === 'production') return
  const file = path.join(__dirname, `../users-${envName}.json`)
  const prev = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []
  prev.push({ ...data, createdAt: new Date().toISOString() })
  fs.writeFileSync(file, JSON.stringify(prev, null, 2))
}

async function main() {
  const [, , cmdRaw, ...rest] = process.argv
  const cmd = (cmdRaw || '').toLowerCase() as Command
  const args = parseArgs(rest)
  const envName = process.env.NODE_ENV || 'development'

  if (!['create', 'list', 'role', 'reset-password'].includes(cmd)) {
    console.error('Usage: users <create|list|role|reset-password> [--email] [--name] [--password] [--role] [--json]')
    process.exit(1)
  }

  if (cmd === 'create') {
    const email = String(args.email || '')
    const name = String(args.name || '')
    const role = (String(args.role || 'recruiter') as keyof typeof Role)
    let password = typeof args.password === 'string' ? String(args.password) : ''
    if (!password) password = generatePassword(16)
    assertPasswordPolicy(password)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error('EMAIL_TAKEN')

    const passwordHash = await bcrypt.hash(password, 12)
    const created = await prisma.user.create({ data: { email, name, passwordHash, role: Role[role] } })
    const out = { id: created.id, email: created.email, name: created.name, role: created.role, password }
    dumpNonProdUser(envName, out)
    if (args.json) console.log(JSON.stringify(out))
    else console.log(out)
  }

  if (cmd === 'list') {
    const role = args.role ? (String(args.role) as keyof typeof Role) : undefined
    const where = role ? { role: Role[role] } : {}
    const rows = await prisma.user.findMany({ where, orderBy: { email: 'asc' } })
    const out = rows.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role }))
    if (args.json) console.log(JSON.stringify(out))
    else console.table(out)
  }

  if (cmd === 'role') {
    const email = String(args.email || '')
    const role = String(args.role || '') as keyof typeof Role
    const updated = await prisma.user.update({ where: { email }, data: { role: Role[role] } })
    const out = { id: updated.id, email: updated.email, name: updated.name, role: updated.role }
    if (args.json) console.log(JSON.stringify(out))
    else console.log(out)
  }

  if (cmd === 'reset-password') {
    const email = String(args.email || '')
    let password = typeof args.password === 'string' ? String(args.password) : ''
    if (!password) password = generatePassword(16)
    assertPasswordPolicy(password)
    const passwordHash = await bcrypt.hash(password, 12)
    const updated = await prisma.user.update({ where: { email }, data: { passwordHash } })
    const out = { id: updated.id, email: updated.email, name: updated.name, role: updated.role, password }
    dumpNonProdUser(envName, out)
    if (args.json) console.log(JSON.stringify(out))
    else console.log(out)
  }
}

main().finally(async () => prisma.$disconnect())


