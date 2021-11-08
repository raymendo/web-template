// src/mocks/browser.js
import { setupWorker } from 'msw'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
import { users, cards, faceprints, fingerprints } from '../mocks/data';

const mockUsageData = {
  users: 365,
  cards: 312,
  cars: 12,
  fingerprints: 26,
  faceprints: 15,
  error: "ERR"
}

export const worker = setupWorker(...handlers(
    mockUsageData,
    users,
    cards,
    fingerprints,
    faceprints
    ))