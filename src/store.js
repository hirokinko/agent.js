/* @flow */
import cookies from 'js-cookie'
import { v4 as uuid } from 'uuid'

import { VERSION as v } from './constants'
import type {
  CustomData,
  ClientEnvironments,
  State,
  Metric,
  SetType,
  Dimension
} from './types'

type StoreType = 'env' | 'custom'

function findOrCreateClientId (name: string): string {
  const c = cookies.get(name)
  if (c) {
    return c
  }
  return uuid().replace(/-/g, '')
}

function parseCustomData (key: Metric | Dimension, value: string | number): CustomData {
  // TODO validate index, value.type
  const data = {}
  let splitedKey = key.split('dimension')
  if (splitedKey.length > 1) {
    data[`cd${splitedKey[1]}`] = value
  }
  splitedKey = key.split('metric')
  if (splitedKey.length > 1) {
    data[`cm${splitedKey[1]}`] = value
  }
  return data
}

export default class Store {
  BASE_URL: string;
  baseUrl: string;
  COOKIE_NAME: string;
  pid: string;
  PROJECT_ID: string;
  state: State;
  constructor (projectId: string, baseUrl: string, cookieName: string): void {
    this.PROJECT_ID = projectId
    this.BASE_URL = baseUrl
    this.COOKIE_NAME = cookieName
    this.state = {
      env: {
        v,
        h: 0,
        w: 0,
        sh: 0,
        sw: 0,
        wh: 0,
        ww: 0
      },
      custom: {}
    }
  }
  set (type: SetType, data: string | number): State {
    switch (type) {
      case 'page':
        return this.merge('env', {l: data})
      default:
        return this.merge('custom', parseCustomData(type, data))
    }
  }
  setObject (data: Object): State {
    if (data.page) {
      this.merge('env', {l: data.page})
      delete data.page
    }
    let result = {}
    Object.keys(data).forEach(key => {
      result = Object.assign({}, result, parseCustomData((key: any), data[key]))
    })
    return this.merge('custom', result)
  }
  merge (type: StoreType, data: ClientEnvironments | CustomData): State {
    let prefix
    switch (type) {
      case 'env':
        const clientId = findOrCreateClientId(this.COOKIE_NAME)
        const loadTime = Date.now()
        this.baseUrl = `${this.BASE_URL}/${this.PROJECT_ID}/${clientId}/${loadTime}`
        prefix = type
        break
      case 'custom':
        // TODO validate
        prefix = type
        break
    }
    if (prefix) {
      for (const key in data) {
        this.state[prefix][key] = data[key]
      }
    }

    return this.state
  }
}
