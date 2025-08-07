import { QueryRunner } from 'typeorm'
import { LoggerFactory } from '@main/logger'

export class DatabaseLogger extends LoggerFactory {
  logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner): void {
    this.debug('Query: ', query, parameters)
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner
  ): void {
    this.error('Failed: ', error, query, parameters)
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void {
    this.warn('Slow: ', time, query, parameters)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    this.debug('Schema build: ', message)
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.debug('Migration: ', message)
  }

  log(level: 'log' | 'info' | 'warn', message: unknown, queryRunner?: QueryRunner): void {}
}
