import { L as LibsqlError, s as supportedUrlLink, i as isInMemoryConfig, R as ResultSetImpl, t as transactionModeToBegin, a as LibsqlBatchError, e as encodeBaseUrl, b as expandConfig } from "./core.mjs";
import Database from "libsql";
import { Buffer } from "node:buffer";
import { C as ClientError, R as ResponseError, P as ProtoError, a as ClosedError, W as WebSocketError, H as HttpServerError, b as ProtocolVersionError, I as InternalError, S as Stmt, B as BatchCond, o as openWs, c as WebSocketUnsupportedError, d as openHttp } from "./hrana-client.mjs";
import { p as promiseLimit } from "../promise-limit.mjs";
function _createClient$4(config) {
  if (config.scheme !== "file") {
    throw new LibsqlError(`URL scheme ${JSON.stringify(config.scheme + ":")} is not supported by the local sqlite3 client. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  const authority = config.authority;
  if (authority !== void 0) {
    const host = authority.host.toLowerCase();
    if (host !== "" && host !== "localhost") {
      throw new LibsqlError(`Invalid host in file URL: ${JSON.stringify(authority.host)}. A "file:" URL with an absolute path should start with one slash ("file:/absolute/path.db") or with three slashes ("file:///absolute/path.db"). For more information, please read ${supportedUrlLink}`, "URL_INVALID");
    }
    if (authority.port !== void 0) {
      throw new LibsqlError("File URL cannot have a port", "URL_INVALID");
    }
    if (authority.userinfo !== void 0) {
      throw new LibsqlError("File URL cannot have username and password", "URL_INVALID");
    }
  }
  let isInMemory = isInMemoryConfig(config);
  if (isInMemory && config.syncUrl) {
    throw new LibsqlError(`Embedded replica must use file for local db but URI with in-memory mode were provided instead: ${config.path}`, "URL_INVALID");
  }
  let path = config.path;
  if (isInMemory) {
    path = `${config.scheme}:${config.path}`;
  }
  const options = {
    authToken: config.authToken,
    encryptionKey: config.encryptionKey,
    remoteEncryptionKey: config.remoteEncryptionKey,
    syncUrl: config.syncUrl,
    syncPeriod: config.syncInterval,
    readYourWrites: config.readYourWrites,
    offline: config.offline
  };
  const db = new Database(path, options);
  executeStmt(db, "SELECT 1 AS checkThatTheDatabaseCanBeOpened", config.intMode);
  return new Sqlite3Client(path, options, db, config.intMode);
}
class Sqlite3Client {
  #path;
  #options;
  #db;
  #intMode;
  closed;
  protocol;
  /** @private */
  constructor(path, options, db, intMode) {
    this.#path = path;
    this.#options = options;
    this.#db = db;
    this.#intMode = intMode;
    this.closed = false;
    this.protocol = "file";
  }
  async execute(stmtOrSql, args) {
    let stmt;
    if (typeof stmtOrSql === "string") {
      stmt = {
        sql: stmtOrSql,
        args: args || []
      };
    } else {
      stmt = stmtOrSql;
    }
    this.#checkNotClosed();
    return executeStmt(this.#getDb(), stmt, this.#intMode);
  }
  async batch(stmts, mode = "deferred") {
    this.#checkNotClosed();
    const db = this.#getDb();
    try {
      executeStmt(db, transactionModeToBegin(mode), this.#intMode);
      const resultSets = [];
      for (let i = 0; i < stmts.length; i++) {
        try {
          if (!db.inTransaction) {
            throw new LibsqlBatchError("The transaction has been rolled back", i, "TRANSACTION_CLOSED");
          }
          const stmt = stmts[i];
          const normalizedStmt = Array.isArray(stmt) ? { sql: stmt[0], args: stmt[1] || [] } : stmt;
          resultSets.push(executeStmt(db, normalizedStmt, this.#intMode));
        } catch (e) {
          if (e instanceof LibsqlBatchError) {
            throw e;
          }
          if (e instanceof LibsqlError) {
            throw new LibsqlBatchError(e.message, i, e.code, e.extendedCode, e.rawCode, e.cause instanceof Error ? e.cause : void 0);
          }
          throw e;
        }
      }
      executeStmt(db, "COMMIT", this.#intMode);
      return resultSets;
    } finally {
      if (db.inTransaction) {
        executeStmt(db, "ROLLBACK", this.#intMode);
      }
    }
  }
  async migrate(stmts) {
    this.#checkNotClosed();
    const db = this.#getDb();
    try {
      executeStmt(db, "PRAGMA foreign_keys=off", this.#intMode);
      executeStmt(db, transactionModeToBegin("deferred"), this.#intMode);
      const resultSets = [];
      for (let i = 0; i < stmts.length; i++) {
        try {
          if (!db.inTransaction) {
            throw new LibsqlBatchError("The transaction has been rolled back", i, "TRANSACTION_CLOSED");
          }
          resultSets.push(executeStmt(db, stmts[i], this.#intMode));
        } catch (e) {
          if (e instanceof LibsqlBatchError) {
            throw e;
          }
          if (e instanceof LibsqlError) {
            throw new LibsqlBatchError(e.message, i, e.code, e.extendedCode, e.rawCode, e.cause instanceof Error ? e.cause : void 0);
          }
          throw e;
        }
      }
      executeStmt(db, "COMMIT", this.#intMode);
      return resultSets;
    } finally {
      if (db.inTransaction) {
        executeStmt(db, "ROLLBACK", this.#intMode);
      }
      executeStmt(db, "PRAGMA foreign_keys=on", this.#intMode);
    }
  }
  async transaction(mode = "write") {
    const db = this.#getDb();
    executeStmt(db, transactionModeToBegin(mode), this.#intMode);
    this.#db = null;
    return new Sqlite3Transaction(db, this.#intMode);
  }
  async executeMultiple(sql) {
    this.#checkNotClosed();
    const db = this.#getDb();
    try {
      return executeMultiple(db, sql);
    } finally {
      if (db.inTransaction) {
        executeStmt(db, "ROLLBACK", this.#intMode);
      }
    }
  }
  async sync() {
    this.#checkNotClosed();
    const rep = await this.#getDb().sync();
    return {
      frames_synced: rep.frames_synced,
      frame_no: rep.frame_no
    };
  }
  async reconnect() {
    try {
      if (!this.closed && this.#db !== null) {
        this.#db.close();
      }
    } finally {
      this.#db = new Database(this.#path, this.#options);
      this.closed = false;
    }
  }
  close() {
    this.closed = true;
    if (this.#db !== null) {
      this.#db.close();
      this.#db = null;
    }
  }
  #checkNotClosed() {
    if (this.closed) {
      throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
    }
  }
  // Lazily creates the database connection and returns it
  #getDb() {
    if (this.#db === null) {
      this.#db = new Database(this.#path, this.#options);
    }
    return this.#db;
  }
}
class Sqlite3Transaction {
  #database;
  #intMode;
  /** @private */
  constructor(database, intMode) {
    this.#database = database;
    this.#intMode = intMode;
  }
  async execute(stmtOrSql, args) {
    let stmt;
    if (typeof stmtOrSql === "string") {
      stmt = {
        sql: stmtOrSql,
        args: args || []
      };
    } else {
      stmt = stmtOrSql;
    }
    this.#checkNotClosed();
    return executeStmt(this.#database, stmt, this.#intMode);
  }
  async batch(stmts) {
    const resultSets = [];
    for (let i = 0; i < stmts.length; i++) {
      try {
        this.#checkNotClosed();
        const stmt = stmts[i];
        const normalizedStmt = Array.isArray(stmt) ? { sql: stmt[0], args: stmt[1] || [] } : stmt;
        resultSets.push(executeStmt(this.#database, normalizedStmt, this.#intMode));
      } catch (e) {
        if (e instanceof LibsqlBatchError) {
          throw e;
        }
        if (e instanceof LibsqlError) {
          throw new LibsqlBatchError(e.message, i, e.code, e.extendedCode, e.rawCode, e.cause instanceof Error ? e.cause : void 0);
        }
        throw e;
      }
    }
    return resultSets;
  }
  async executeMultiple(sql) {
    this.#checkNotClosed();
    return executeMultiple(this.#database, sql);
  }
  async rollback() {
    if (!this.#database.open) {
      return;
    }
    this.#checkNotClosed();
    executeStmt(this.#database, "ROLLBACK", this.#intMode);
  }
  async commit() {
    this.#checkNotClosed();
    executeStmt(this.#database, "COMMIT", this.#intMode);
  }
  close() {
    if (this.#database.inTransaction) {
      executeStmt(this.#database, "ROLLBACK", this.#intMode);
    }
  }
  get closed() {
    return !this.#database.inTransaction;
  }
  #checkNotClosed() {
    if (this.closed) {
      throw new LibsqlError("The transaction is closed", "TRANSACTION_CLOSED");
    }
  }
}
function executeStmt(db, stmt, intMode) {
  let sql;
  let args;
  if (typeof stmt === "string") {
    sql = stmt;
    args = [];
  } else {
    sql = stmt.sql;
    if (Array.isArray(stmt.args)) {
      args = stmt.args.map((value) => valueToSql(value, intMode));
    } else {
      args = {};
      for (const name in stmt.args) {
        const argName = name[0] === "@" || name[0] === "$" || name[0] === ":" ? name.substring(1) : name;
        args[argName] = valueToSql(stmt.args[name], intMode);
      }
    }
  }
  try {
    const sqlStmt = db.prepare(sql);
    sqlStmt.safeIntegers(true);
    let returnsData = true;
    try {
      sqlStmt.raw(true);
    } catch {
      returnsData = false;
    }
    if (returnsData) {
      const columns = Array.from(sqlStmt.columns().map((col) => col.name));
      const columnTypes = Array.from(sqlStmt.columns().map((col) => col.type ?? ""));
      const rows = sqlStmt.all(args).map((sqlRow) => {
        return rowFromSql(sqlRow, columns, intMode);
      });
      const rowsAffected = 0;
      const lastInsertRowid = void 0;
      return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
    } else {
      const info = sqlStmt.run(args);
      const rowsAffected = info.changes;
      const lastInsertRowid = BigInt(info.lastInsertRowid);
      return new ResultSetImpl([], [], [], rowsAffected, lastInsertRowid);
    }
  } catch (e) {
    throw mapSqliteError(e);
  }
}
function rowFromSql(sqlRow, columns, intMode) {
  const row = {};
  Object.defineProperty(row, "length", { value: sqlRow.length });
  for (let i = 0; i < sqlRow.length; ++i) {
    const value = valueFromSql(sqlRow[i], intMode);
    Object.defineProperty(row, i, { value });
    const column = columns[i];
    if (!Object.hasOwn(row, column)) {
      Object.defineProperty(row, column, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
  }
  return row;
}
function valueFromSql(sqlValue, intMode) {
  if (typeof sqlValue === "bigint") {
    if (intMode === "number") {
      if (sqlValue < minSafeBigint || sqlValue > maxSafeBigint) {
        throw new RangeError("Received integer which cannot be safely represented as a JavaScript number");
      }
      return Number(sqlValue);
    } else if (intMode === "bigint") {
      return sqlValue;
    } else if (intMode === "string") {
      return "" + sqlValue;
    } else {
      throw new Error("Invalid value for IntMode");
    }
  } else if (sqlValue instanceof Buffer) {
    return sqlValue.buffer;
  }
  return sqlValue;
}
const minSafeBigint = -9007199254740991n;
const maxSafeBigint = 9007199254740991n;
function valueToSql(value, intMode) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
    }
    return value;
  } else if (typeof value === "bigint") {
    if (value < minInteger || value > maxInteger) {
      throw new RangeError("bigint is too large to be represented as a 64-bit integer and passed as argument");
    }
    return value;
  } else if (typeof value === "boolean") {
    switch (intMode) {
      case "bigint":
        return value ? 1n : 0n;
      case "string":
        return value ? "1" : "0";
      default:
        return value ? 1 : 0;
    }
  } else if (value instanceof ArrayBuffer) {
    return Buffer.from(value);
  } else if (value instanceof Date) {
    return value.valueOf();
  } else if (value === void 0) {
    throw new TypeError("undefined cannot be passed as argument to the database");
  } else {
    return value;
  }
}
const minInteger = -9223372036854775808n;
const maxInteger = 9223372036854775807n;
function executeMultiple(db, sql) {
  try {
    db.exec(sql);
  } catch (e) {
    throw mapSqliteError(e);
  }
}
function mapSqliteError(e) {
  if (e instanceof Database.SqliteError) {
    const extendedCode = e.code;
    const code = mapToBaseCode(e.rawCode);
    return new LibsqlError(e.message, code, extendedCode, e.rawCode, e);
  }
  return e;
}
function mapToBaseCode(rawCode) {
  if (rawCode === void 0) {
    return "SQLITE_UNKNOWN";
  }
  const baseCode = rawCode & 255;
  return sqliteErrorCodes[baseCode] ?? `SQLITE_UNKNOWN_${baseCode.toString()}`;
}
const sqliteErrorCodes = {
  1: "SQLITE_ERROR",
  2: "SQLITE_INTERNAL",
  3: "SQLITE_PERM",
  4: "SQLITE_ABORT",
  5: "SQLITE_BUSY",
  6: "SQLITE_LOCKED",
  7: "SQLITE_NOMEM",
  8: "SQLITE_READONLY",
  9: "SQLITE_INTERRUPT",
  10: "SQLITE_IOERR",
  11: "SQLITE_CORRUPT",
  12: "SQLITE_NOTFOUND",
  13: "SQLITE_FULL",
  14: "SQLITE_CANTOPEN",
  15: "SQLITE_PROTOCOL",
  16: "SQLITE_EMPTY",
  17: "SQLITE_SCHEMA",
  18: "SQLITE_TOOBIG",
  19: "SQLITE_CONSTRAINT",
  20: "SQLITE_MISMATCH",
  21: "SQLITE_MISUSE",
  22: "SQLITE_NOLFS",
  23: "SQLITE_AUTH",
  24: "SQLITE_FORMAT",
  25: "SQLITE_RANGE",
  26: "SQLITE_NOTADB",
  27: "SQLITE_NOTICE",
  28: "SQLITE_WARNING"
};
class HranaTransaction {
  #mode;
  #version;
  // Promise that is resolved when the BEGIN statement completes, or `undefined` if we haven't executed the
  // BEGIN statement yet.
  #started;
  /** @private */
  constructor(mode, version) {
    this.#mode = mode;
    this.#version = version;
    this.#started = void 0;
  }
  execute(stmt) {
    return this.batch([stmt]).then((results) => results[0]);
  }
  async batch(stmts) {
    const stream = this._getStream();
    if (stream.closed) {
      throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
    }
    try {
      const hranaStmts = stmts.map(stmtToHrana);
      let rowsPromises;
      if (this.#started === void 0) {
        this._getSqlCache().apply(hranaStmts);
        const batch = stream.batch(this.#version >= 3);
        const beginStep = batch.step();
        const beginPromise = beginStep.run(transactionModeToBegin(this.#mode));
        let lastStep = beginStep;
        rowsPromises = hranaStmts.map((hranaStmt) => {
          const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
          if (this.#version >= 3) {
            stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
          }
          const rowsPromise = stmtStep.query(hranaStmt);
          rowsPromise.catch(() => void 0);
          lastStep = stmtStep;
          return rowsPromise;
        });
        this.#started = batch.execute().then(() => beginPromise).then(() => void 0);
        try {
          await this.#started;
        } catch (e) {
          this.close();
          throw e;
        }
      } else {
        if (this.#version < 3) {
          await this.#started;
        } else {
        }
        this._getSqlCache().apply(hranaStmts);
        const batch = stream.batch(this.#version >= 3);
        let lastStep = void 0;
        rowsPromises = hranaStmts.map((hranaStmt) => {
          const stmtStep = batch.step();
          if (lastStep !== void 0) {
            stmtStep.condition(BatchCond.ok(lastStep));
          }
          if (this.#version >= 3) {
            stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
          }
          const rowsPromise = stmtStep.query(hranaStmt);
          rowsPromise.catch(() => void 0);
          lastStep = stmtStep;
          return rowsPromise;
        });
        await batch.execute();
      }
      const resultSets = [];
      for (let i = 0; i < rowsPromises.length; i++) {
        try {
          const rows = await rowsPromises[i];
          if (rows === void 0) {
            throw new LibsqlBatchError("Statement in a transaction was not executed, probably because the transaction has been rolled back", i, "TRANSACTION_CLOSED");
          }
          resultSets.push(resultSetFromHrana(rows));
        } catch (e) {
          if (e instanceof LibsqlBatchError) {
            throw e;
          }
          const mappedError = mapHranaError(e);
          if (mappedError instanceof LibsqlError) {
            throw new LibsqlBatchError(mappedError.message, i, mappedError.code, mappedError.extendedCode, mappedError.rawCode, mappedError.cause instanceof Error ? mappedError.cause : void 0);
          }
          throw mappedError;
        }
      }
      return resultSets;
    } catch (e) {
      throw mapHranaError(e);
    }
  }
  async executeMultiple(sql) {
    const stream = this._getStream();
    if (stream.closed) {
      throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
    }
    try {
      if (this.#started === void 0) {
        this.#started = stream.run(transactionModeToBegin(this.#mode)).then(() => void 0);
        try {
          await this.#started;
        } catch (e) {
          this.close();
          throw e;
        }
      } else {
        await this.#started;
      }
      await stream.sequence(sql);
    } catch (e) {
      throw mapHranaError(e);
    }
  }
  async rollback() {
    try {
      const stream = this._getStream();
      if (stream.closed) {
        return;
      }
      if (this.#started !== void 0) {
      } else {
        return;
      }
      const promise = stream.run("ROLLBACK").catch((e) => {
        throw mapHranaError(e);
      });
      stream.closeGracefully();
      await promise;
    } catch (e) {
      throw mapHranaError(e);
    } finally {
      this.close();
    }
  }
  async commit() {
    try {
      const stream = this._getStream();
      if (stream.closed) {
        throw new LibsqlError("Cannot commit the transaction because it is already closed", "TRANSACTION_CLOSED");
      }
      if (this.#started !== void 0) {
        await this.#started;
      } else {
        return;
      }
      const promise = stream.run("COMMIT").catch((e) => {
        throw mapHranaError(e);
      });
      stream.closeGracefully();
      await promise;
    } catch (e) {
      throw mapHranaError(e);
    } finally {
      this.close();
    }
  }
}
async function executeHranaBatch(mode, version, batch, hranaStmts, disableForeignKeys = false) {
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=off");
  }
  const beginStep = batch.step();
  const beginPromise = beginStep.run(transactionModeToBegin(mode));
  let lastStep = beginStep;
  const stmtPromises = hranaStmts.map((hranaStmt) => {
    const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
    if (version >= 3) {
      stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
    }
    const stmtPromise = stmtStep.query(hranaStmt);
    lastStep = stmtStep;
    return stmtPromise;
  });
  const commitStep = batch.step().condition(BatchCond.ok(lastStep));
  if (version >= 3) {
    commitStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
  }
  const commitPromise = commitStep.run("COMMIT");
  const rollbackStep = batch.step().condition(BatchCond.not(BatchCond.ok(commitStep)));
  rollbackStep.run("ROLLBACK").catch((_) => void 0);
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=on");
  }
  await batch.execute();
  const resultSets = [];
  await beginPromise;
  for (let i = 0; i < stmtPromises.length; i++) {
    try {
      const hranaRows = await stmtPromises[i];
      if (hranaRows === void 0) {
        throw new LibsqlBatchError("Statement in a batch was not executed, probably because the transaction has been rolled back", i, "TRANSACTION_CLOSED");
      }
      resultSets.push(resultSetFromHrana(hranaRows));
    } catch (e) {
      if (e instanceof LibsqlBatchError) {
        throw e;
      }
      const mappedError = mapHranaError(e);
      if (mappedError instanceof LibsqlError) {
        throw new LibsqlBatchError(mappedError.message, i, mappedError.code, mappedError.extendedCode, mappedError.rawCode, mappedError.cause instanceof Error ? mappedError.cause : void 0);
      }
      throw mappedError;
    }
  }
  await commitPromise;
  return resultSets;
}
function stmtToHrana(stmt) {
  let sql;
  let args;
  if (Array.isArray(stmt)) {
    [sql, args] = stmt;
  } else if (typeof stmt === "string") {
    sql = stmt;
  } else {
    sql = stmt.sql;
    args = stmt.args;
  }
  const hranaStmt = new Stmt(sql);
  if (args) {
    if (Array.isArray(args)) {
      hranaStmt.bindIndexes(args);
    } else {
      for (const [key, value] of Object.entries(args)) {
        hranaStmt.bindName(key, value);
      }
    }
  }
  return hranaStmt;
}
function resultSetFromHrana(hranaRows) {
  const columns = hranaRows.columnNames.map((c) => c ?? "");
  const columnTypes = hranaRows.columnDecltypes.map((c) => c ?? "");
  const rows = hranaRows.rows;
  const rowsAffected = hranaRows.affectedRowCount;
  const lastInsertRowid = hranaRows.lastInsertRowid !== void 0 ? hranaRows.lastInsertRowid : void 0;
  return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
}
function mapHranaError(e) {
  if (e instanceof ClientError) {
    const code = mapHranaErrorCode(e);
    return new LibsqlError(e.message, code, void 0, void 0, e);
  }
  return e;
}
function mapHranaErrorCode(e) {
  if (e instanceof ResponseError && e.code !== void 0) {
    return e.code;
  } else if (e instanceof ProtoError) {
    return "HRANA_PROTO_ERROR";
  } else if (e instanceof ClosedError) {
    return e.cause instanceof ClientError ? mapHranaErrorCode(e.cause) : "HRANA_CLOSED_ERROR";
  } else if (e instanceof WebSocketError) {
    return "HRANA_WEBSOCKET_ERROR";
  } else if (e instanceof HttpServerError) {
    return "SERVER_ERROR";
  } else if (e instanceof ProtocolVersionError) {
    return "PROTOCOL_VERSION_ERROR";
  } else if (e instanceof InternalError) {
    return "INTERNAL_ERROR";
  } else {
    return "UNKNOWN";
  }
}
class SqlCache {
  #owner;
  #sqls;
  capacity;
  constructor(owner, capacity) {
    this.#owner = owner;
    this.#sqls = new Lru();
    this.capacity = capacity;
  }
  // Replaces SQL strings with cached `hrana.Sql` objects in the statements in `hranaStmts`. After this
  // function returns, we guarantee that all `hranaStmts` refer to valid (not closed) `hrana.Sql` objects,
  // but _we may invalidate any other `hrana.Sql` objects_ (by closing them, thus removing them from the
  // server).
  //
  // In practice, this means that after calling this function, you can use the statements only up to the
  // first `await`, because concurrent code may also use the cache and invalidate those statements.
  apply(hranaStmts) {
    if (this.capacity <= 0) {
      return;
    }
    const usedSqlObjs = /* @__PURE__ */ new Set();
    for (const hranaStmt of hranaStmts) {
      if (typeof hranaStmt.sql !== "string") {
        continue;
      }
      const sqlText = hranaStmt.sql;
      if (sqlText.length >= 5e3) {
        continue;
      }
      let sqlObj = this.#sqls.get(sqlText);
      if (sqlObj === void 0) {
        while (this.#sqls.size + 1 > this.capacity) {
          const [evictSqlText, evictSqlObj] = this.#sqls.peekLru();
          if (usedSqlObjs.has(evictSqlObj)) {
            break;
          }
          evictSqlObj.close();
          this.#sqls.delete(evictSqlText);
        }
        if (this.#sqls.size + 1 <= this.capacity) {
          sqlObj = this.#owner.storeSql(sqlText);
          this.#sqls.set(sqlText, sqlObj);
        }
      }
      if (sqlObj !== void 0) {
        hranaStmt.sql = sqlObj;
        usedSqlObjs.add(sqlObj);
      }
    }
  }
}
class Lru {
  // This maps keys to the cache values. The entries are ordered by their last use (entires that were used
  // most recently are at the end).
  #cache;
  constructor() {
    this.#cache = /* @__PURE__ */ new Map();
  }
  get(key) {
    const value = this.#cache.get(key);
    if (value !== void 0) {
      this.#cache.delete(key);
      this.#cache.set(key, value);
    }
    return value;
  }
  set(key, value) {
    this.#cache.set(key, value);
  }
  peekLru() {
    for (const entry of this.#cache.entries()) {
      return entry;
    }
    return void 0;
  }
  delete(key) {
    this.#cache.delete(key);
  }
  get size() {
    return this.#cache.size;
  }
}
function _createClient$3(config) {
  if (config.scheme !== "wss" && config.scheme !== "ws") {
    throw new LibsqlError(`The WebSocket client supports only "libsql:", "wss:" and "ws:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config.scheme === "ws" && config.tls) {
    throw new LibsqlError(`A "ws:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config.scheme === "wss" && !config.tls) {
    throw new LibsqlError(`A "wss:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url = encodeBaseUrl(config.scheme, config.authority, config.path);
  let client;
  try {
    client = openWs(url, config.authToken);
  } catch (e) {
    if (e instanceof WebSocketUnsupportedError) {
      const suggestedScheme = config.scheme === "wss" ? "https" : "http";
      const suggestedUrl = encodeBaseUrl(suggestedScheme, config.authority, config.path);
      throw new LibsqlError(`This environment does not support WebSockets, please switch to the HTTP client by using a "${suggestedScheme}:" URL (${JSON.stringify(suggestedUrl)}). For more information, please read ${supportedUrlLink}`, "WEBSOCKETS_NOT_SUPPORTED");
    }
    throw mapHranaError(e);
  }
  return new WsClient(client, url, config.authToken, config.intMode, config.concurrency);
}
const maxConnAgeMillis = 60 * 1e3;
const sqlCacheCapacity$1 = 100;
class WsClient {
  #url;
  #authToken;
  #intMode;
  // State of the current connection. The `hrana.WsClient` inside may be closed at any moment due to an
  // asynchronous error.
  #connState;
  // If defined, this is a connection that will be used in the future, once it is ready.
  #futureConnState;
  closed;
  protocol;
  #isSchemaDatabase;
  #promiseLimitFunction;
  /** @private */
  constructor(client, url, authToken, intMode, concurrency) {
    this.#url = url;
    this.#authToken = authToken;
    this.#intMode = intMode;
    this.#connState = this.#openConn(client);
    this.#futureConnState = void 0;
    this.closed = false;
    this.protocol = "ws";
    this.#promiseLimitFunction = promiseLimit(concurrency);
  }
  async limit(fn) {
    return this.#promiseLimitFunction(fn);
  }
  async execute(stmtOrSql, args) {
    let stmt;
    if (typeof stmtOrSql === "string") {
      stmt = {
        sql: stmtOrSql,
        args: args || []
      };
    } else {
      stmt = stmtOrSql;
    }
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const hranaStmt = stmtToHrana(stmt);
        streamState.conn.sqlCache.apply([hranaStmt]);
        const hranaRowsPromise = streamState.stream.query(hranaStmt);
        streamState.stream.closeGracefully();
        const hranaRowsResult = await hranaRowsPromise;
        return resultSetFromHrana(hranaRowsResult);
      } catch (e) {
        throw mapHranaError(e);
      } finally {
        this._closeStream(streamState);
      }
    });
  }
  async batch(stmts, mode = "deferred") {
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const normalizedStmts = stmts.map((stmt) => {
          if (Array.isArray(stmt)) {
            return {
              sql: stmt[0],
              args: stmt[1] || []
            };
          }
          return stmt;
        });
        const hranaStmts = normalizedStmts.map(stmtToHrana);
        const version = await streamState.conn.client.getVersion();
        streamState.conn.sqlCache.apply(hranaStmts);
        const batch = streamState.stream.batch(version >= 3);
        const resultsPromise = executeHranaBatch(mode, version, batch, hranaStmts);
        const results = await resultsPromise;
        return results;
      } catch (e) {
        throw mapHranaError(e);
      } finally {
        this._closeStream(streamState);
      }
    });
  }
  async migrate(stmts) {
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const hranaStmts = stmts.map(stmtToHrana);
        const version = await streamState.conn.client.getVersion();
        const batch = streamState.stream.batch(version >= 3);
        const resultsPromise = executeHranaBatch("deferred", version, batch, hranaStmts, true);
        const results = await resultsPromise;
        return results;
      } catch (e) {
        throw mapHranaError(e);
      } finally {
        this._closeStream(streamState);
      }
    });
  }
  async transaction(mode = "write") {
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const version = await streamState.conn.client.getVersion();
        return new WsTransaction(this, streamState, mode, version);
      } catch (e) {
        this._closeStream(streamState);
        throw mapHranaError(e);
      }
    });
  }
  async executeMultiple(sql) {
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const promise = streamState.stream.sequence(sql);
        streamState.stream.closeGracefully();
        await promise;
      } catch (e) {
        throw mapHranaError(e);
      } finally {
        this._closeStream(streamState);
      }
    });
  }
  sync() {
    throw new LibsqlError("sync not supported in ws mode", "SYNC_NOT_SUPPORTED");
  }
  async #openStream() {
    if (this.closed) {
      throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
    }
    const now = /* @__PURE__ */ new Date();
    const ageMillis = now.valueOf() - this.#connState.openTime.valueOf();
    if (ageMillis > maxConnAgeMillis && this.#futureConnState === void 0) {
      const futureConnState = this.#openConn();
      this.#futureConnState = futureConnState;
      futureConnState.client.getVersion().then((_version) => {
        if (this.#connState !== futureConnState) {
          if (this.#connState.streamStates.size === 0) {
            this.#connState.client.close();
          }
        }
        this.#connState = futureConnState;
        this.#futureConnState = void 0;
      }, (_e) => {
        this.#futureConnState = void 0;
      });
    }
    if (this.#connState.client.closed) {
      try {
        if (this.#futureConnState !== void 0) {
          this.#connState = this.#futureConnState;
        } else {
          this.#connState = this.#openConn();
        }
      } catch (e) {
        throw mapHranaError(e);
      }
    }
    const connState = this.#connState;
    try {
      if (connState.useSqlCache === void 0) {
        connState.useSqlCache = await connState.client.getVersion() >= 2;
        if (connState.useSqlCache) {
          connState.sqlCache.capacity = sqlCacheCapacity$1;
        }
      }
      const stream = connState.client.openStream();
      stream.intMode = this.#intMode;
      const streamState = { conn: connState, stream };
      connState.streamStates.add(streamState);
      return streamState;
    } catch (e) {
      throw mapHranaError(e);
    }
  }
  #openConn(client) {
    try {
      client ??= openWs(this.#url, this.#authToken);
      return {
        client,
        useSqlCache: void 0,
        sqlCache: new SqlCache(client, 0),
        openTime: /* @__PURE__ */ new Date(),
        streamStates: /* @__PURE__ */ new Set()
      };
    } catch (e) {
      throw mapHranaError(e);
    }
  }
  async reconnect() {
    try {
      for (const st of Array.from(this.#connState.streamStates)) {
        try {
          st.stream.close();
        } catch {
        }
      }
      this.#connState.client.close();
    } catch {
    }
    if (this.#futureConnState) {
      try {
        this.#futureConnState.client.close();
      } catch {
      }
      this.#futureConnState = void 0;
    }
    const next = this.#openConn();
    const version = await next.client.getVersion();
    next.useSqlCache = version >= 2;
    if (next.useSqlCache) {
      next.sqlCache.capacity = sqlCacheCapacity$1;
    }
    this.#connState = next;
    this.closed = false;
  }
  _closeStream(streamState) {
    streamState.stream.close();
    const connState = streamState.conn;
    connState.streamStates.delete(streamState);
    if (connState.streamStates.size === 0 && connState !== this.#connState) {
      connState.client.close();
    }
  }
  close() {
    this.#connState.client.close();
    this.closed = true;
    if (this.#futureConnState) {
      try {
        this.#futureConnState.client.close();
      } catch {
      }
      this.#futureConnState = void 0;
    }
    this.closed = true;
  }
}
class WsTransaction extends HranaTransaction {
  #client;
  #streamState;
  /** @private */
  constructor(client, state, mode, version) {
    super(mode, version);
    this.#client = client;
    this.#streamState = state;
  }
  /** @private */
  _getStream() {
    return this.#streamState.stream;
  }
  /** @private */
  _getSqlCache() {
    return this.#streamState.conn.sqlCache;
  }
  close() {
    this.#client._closeStream(this.#streamState);
  }
  get closed() {
    return this.#streamState.stream.closed;
  }
}
function _createClient$2(config) {
  if (config.scheme !== "https" && config.scheme !== "http") {
    throw new LibsqlError(`The HTTP client supports only "libsql:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config.scheme === "http" && config.tls) {
    throw new LibsqlError(`A "http:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config.scheme === "https" && !config.tls) {
    throw new LibsqlError(`A "https:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url = encodeBaseUrl(config.scheme, config.authority, config.path);
  return new HttpClient(url, config.authToken, config.intMode, config.fetch, config.concurrency, config.remoteEncryptionKey);
}
const sqlCacheCapacity = 30;
class HttpClient {
  #client;
  protocol;
  #url;
  #intMode;
  #customFetch;
  #concurrency;
  #authToken;
  #remoteEncryptionKey;
  #promiseLimitFunction;
  /** @private */
  constructor(url, authToken, intMode, customFetch, concurrency, remoteEncryptionKey) {
    this.#url = url;
    this.#authToken = authToken;
    this.#intMode = intMode;
    this.#customFetch = customFetch;
    this.#concurrency = concurrency;
    this.#remoteEncryptionKey = remoteEncryptionKey;
    this.#client = openHttp(this.#url, this.#authToken, this.#customFetch, remoteEncryptionKey);
    this.#client.intMode = this.#intMode;
    this.protocol = "http";
    this.#promiseLimitFunction = promiseLimit(this.#concurrency);
  }
  async limit(fn) {
    return this.#promiseLimitFunction(fn);
  }
  async execute(stmtOrSql, args) {
    let stmt;
    if (typeof stmtOrSql === "string") {
      stmt = {
        sql: stmtOrSql,
        args: args || []
      };
    } else {
      stmt = stmtOrSql;
    }
    return this.limit(async () => {
      try {
        const hranaStmt = stmtToHrana(stmt);
        let rowsPromise;
        const stream = this.#client.openStream();
        try {
          rowsPromise = stream.query(hranaStmt);
        } finally {
          stream.closeGracefully();
        }
        const rowsResult = await rowsPromise;
        return resultSetFromHrana(rowsResult);
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  async batch(stmts, mode = "deferred") {
    return this.limit(async () => {
      try {
        const normalizedStmts = stmts.map((stmt) => {
          if (Array.isArray(stmt)) {
            return {
              sql: stmt[0],
              args: stmt[1] || []
            };
          }
          return stmt;
        });
        const hranaStmts = normalizedStmts.map(stmtToHrana);
        const version = await this.#client.getVersion();
        let resultsPromise;
        const stream = this.#client.openStream();
        try {
          const sqlCache = new SqlCache(stream, sqlCacheCapacity);
          sqlCache.apply(hranaStmts);
          const batch = stream.batch(false);
          resultsPromise = executeHranaBatch(mode, version, batch, hranaStmts);
        } finally {
          stream.closeGracefully();
        }
        const results = await resultsPromise;
        return results;
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  async migrate(stmts) {
    return this.limit(async () => {
      try {
        const hranaStmts = stmts.map(stmtToHrana);
        const version = await this.#client.getVersion();
        let resultsPromise;
        const stream = this.#client.openStream();
        try {
          const batch = stream.batch(false);
          resultsPromise = executeHranaBatch("deferred", version, batch, hranaStmts, true);
        } finally {
          stream.closeGracefully();
        }
        const results = await resultsPromise;
        return results;
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  async transaction(mode = "write") {
    return this.limit(async () => {
      try {
        const version = await this.#client.getVersion();
        return new HttpTransaction(this.#client.openStream(), mode, version);
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  async executeMultiple(sql) {
    return this.limit(async () => {
      try {
        let promise;
        const stream = this.#client.openStream();
        try {
          promise = stream.sequence(sql);
        } finally {
          stream.closeGracefully();
        }
        await promise;
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  sync() {
    throw new LibsqlError("sync not supported in http mode", "SYNC_NOT_SUPPORTED");
  }
  close() {
    this.#client.close();
  }
  async reconnect() {
    try {
      if (!this.closed) {
        this.#client.close();
      }
    } finally {
      this.#client = openHttp(this.#url, this.#authToken, this.#customFetch, this.#remoteEncryptionKey);
      this.#client.intMode = this.#intMode;
    }
  }
  get closed() {
    return this.#client.closed;
  }
}
class HttpTransaction extends HranaTransaction {
  #stream;
  #sqlCache;
  /** @private */
  constructor(stream, mode, version) {
    super(mode, version);
    this.#stream = stream;
    this.#sqlCache = new SqlCache(stream, sqlCacheCapacity);
  }
  /** @private */
  _getStream() {
    return this.#stream;
  }
  /** @private */
  _getSqlCache() {
    return this.#sqlCache;
  }
  close() {
    this.#stream.close();
  }
  get closed() {
    return this.#stream.closed;
  }
}
function createClient$1(config) {
  return _createClient$1(expandConfig(config));
}
function _createClient$1(config) {
  if (config.scheme === "wss" || config.scheme === "ws") {
    return _createClient$3(config);
  } else if (config.scheme === "https" || config.scheme === "http") {
    return _createClient$2(config);
  } else {
    return _createClient$4(config);
  }
}
function createClient(config) {
  return _createClient(expandConfig(config));
}
function _createClient(config) {
  if (config.scheme === "ws" || config.scheme === "wss") {
    return _createClient$3(config);
  } else if (config.scheme === "http" || config.scheme === "https") {
    return _createClient$2(config);
  } else {
    throw new LibsqlError(`The client that uses Web standard APIs supports only "libsql:", "wss:", "ws:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
}
export {
  createClient as a,
  createClient$1 as c
};
