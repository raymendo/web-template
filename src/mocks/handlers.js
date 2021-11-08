import { rest } from "msw";
import { API_URL, mswEnabled } from "../config";

function mswEnabledOnly() {
  const apiResponse = {
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTc2OTM4MTUwLCJleHAiOjE1Nzk1MzAxNTB9.UgsjjXkAZ-anD257BF7y1hbjuY3ogNceKfTAQtzDEsU",
    user: {
        id: 1,
        username: "reader"
    }
  }
  const handlers = []
  if (mswEnabled) {
    handlers.push(
      rest.post(API_URL + '/auth/local', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(apiResponse))
      })
    )
  }
  return handlers
}

export const handlers = (
  mockUsageData = {},
  mockUsers = {},
  mockCards = [],
  mockfiprints = [],
  mockfaprints = [],
  ) => {
  return [
    rest.get(API_URL + '/users/count', (req, res, ctx) => {
      return res(ctx.json(mockUsageData["users"]))
    }),
    rest.get(API_URL + '/cards/count', (req, res, ctx) => {
      return res(ctx.json(mockUsageData["cards"]))
    }),
    rest.get(API_URL + '/cars/count', (req, res, ctx) => {
      return res(ctx.json(mockUsageData["cars"]))
    }),
    rest.get(API_URL + '/fingerprints/count', (req, res, ctx) => {
      return res(ctx.json(mockUsageData["fingerprints"]))
    }),
    rest.get(API_URL + '/faceprints/count', (req, res, ctx) => {
      return res(ctx.json(mockUsageData["faceprints"]))
    }),
    rest.get(API_URL + '/users', (req, res, ctx) => {
      return res(ctx.json(mockUsers))
    }),
    rest.get(API_URL + '/cards', (req, res, ctx) => {
      const userid = req.url.searchParams.get('user')
      
      if (userid) {
        return res(
          ctx.json(
            mockCards.filter(card => card.user.id === userid)
          )
        )
      }
      return res(ctx.json(mockCards))
    }),
    rest.get(API_URL + '/fingerprints', (req, res, ctx) => {
      const userid = req.url.searchParams.get('user')
      
      if (userid) {
        return res(
          ctx.json(
            mockfiprints.filter(fprint => fprint.user.id === userid)
          )
        )
      }
      return res(ctx.json(mockfiprints))
    }),
    rest.get(API_URL + '/faceprints', (req, res, ctx) => {
      const userid = req.url.searchParams.get('user')
      
      if (userid) {
        return res(
          ctx.json(
            mockfaprints.filter(fprint => fprint.user.id === userid)
          )
        )
      }
      return res(ctx.json(mockfaprints))
    }),
    ...mswEnabledOnly(),
    rest.get(API_URL + '/*', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({error: true}))
    }),
    // rest.get('*', (req, res, ctx) => {
    //   return ctx.fetch(req);
    // })
  ];
}
