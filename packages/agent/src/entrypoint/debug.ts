import * as Raven from 'raven-js'

import Agent from '../agent'
import { getName } from '../browser'
import factory from '../global'
import { SettingFieldsObject } from '../types'

Raven.config(process.env.RAVEN_DSN as string).install()

class DebugAgent extends Agent {
  public constructor(
    projectId: string,
    cookieName: string,
    options: SettingFieldsObject
  ) {
    options['Raven'] = Raven
    super(projectId, cookieName, options)
  }
}

factory(DebugAgent, {}, getName(document))
