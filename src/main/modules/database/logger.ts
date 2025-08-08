import { QueryRunner } from 'typeorm'
import { LoggerFactory } from '@main/logger'

export class DatabaseLogger extends LoggerFactory {
  logQuery(query: string, parameters?: unknown[], _queryRunner?: QueryRunner): void {
    this.debug('Query: ', query, parameters)
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {
    this.error('Failed: ', error, query, parameters)
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {
    this.warn('Slow: ', time, query, parameters)
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
    this.debug('Schema build: ', message)
  }

  logMigration(message: string, _queryRunner?: QueryRunner): void {
    this.debug('Migration: ', message)
  }

  log(_level: 'log' | 'info' | 'warn', _message: unknown, _queryRunner?: QueryRunner): void {
    //
  }
}
