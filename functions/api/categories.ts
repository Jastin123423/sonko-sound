import type { PagesFunction } from '@cloudflare/workers-types';

type Env = { DB: D1Database };

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: cors });

const str = (v: any) => String(v ?? '').trim();

const buildCategoryResponse = (row: any) => {
  const appFlag = Number(row?.app_flag ?? 1);

  return {
    id: String(row?.id ?? ''),
    name: String(row?.name ?? ''),
    icon: row?.icon == null ? null : String(row.icon),
    created_at: String(row?.created_at ?? ''),
    updated_at: String(row?.updated_at ?? ''),
    app_flag: appFlag,
    appFlag,
  };
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.DB) {
      return json({ success: false, error: 'DB binding missing (DB)' }, 500);
    }

    const url = new URL(request.url);
    const id = str(url.searchParams.get('id'));
    const app = str(url.searchParams.get('app')).toLowerCase();

    const isSoundApp = app === 'sound';
    const isBarakaApp = app === 'baraka';

    if (id) {
      let query = `
        SELECT id, name, icon, created_at, updated_at, app_flag
        FROM categories
        WHERE id = ?
      `;
      const binds: any[] = [id];

      if (isSoundApp) {
        query += ` AND app_flag = 1`;
      } else if (isBarakaApp) {
        query += ` AND app_flag = 0`;
      }

      query += ` LIMIT 1`;

      const row = await env.DB.prepare(query).bind(...binds).first<any>();

      if (!row) return json({ success: false, error: 'Not found' }, 404);
      return json({ success: true, data: buildCategoryResponse(row) });
    }

    let query = `
      SELECT id, name, icon, created_at, updated_at, app_flag
      FROM categories
    `;
    const binds: any[] = [];

    if (isSoundApp) {
      query += ` WHERE app_flag = 1`;
    } else if (isBarakaApp) {
      query += ` WHERE app_flag = 0`;
    }

    query += ` ORDER BY CAST(id AS INTEGER) ASC`;

    const rows = await env.DB.prepare(query).bind(...binds).all<any>();
    const list = (rows.results || []).map((row: any) => buildCategoryResponse(row));

    return json({
      success: true,
      app,
      filtered: isSoundApp || isBarakaApp,
      count: list.length,
      data: list,
    });
  } catch (e: any) {
    return json({ success: false, error: e?.message || 'Failed to load categories' }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.DB) return json({ success: false, error: 'DB binding missing (DB)' }, 500);

    const body = await request.json().catch(() => ({}));
    const id = body.id != null ? str(body.id) : crypto.randomUUID();
    const name = str(body.name);
    const icon = body.icon != null ? str(body.icon) : null;

    // Default this Sonko Sound categories API to app_flag = 1
    const appFlag =
      body.app_flag !== undefined || body.appFlag !== undefined || body.app !== undefined
        ? Number(body.app_flag ?? body.appFlag ?? body.app ?? 1)
        : 1;

    if (!name) return json({ success: false, error: 'Missing required field: name' }, 400);

    await env.DB
      .prepare(
        `INSERT INTO categories (id, name, icon, app_flag, created_at, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .bind(id, name, icon, appFlag === 0 ? 0 : 1)
      .run();

    const row = await env.DB
      .prepare(`SELECT id, name, icon, created_at, updated_at, app_flag FROM categories WHERE id=? LIMIT 1`)
      .bind(id)
      .first<any>();

    return json({ success: true, data: buildCategoryResponse(row) }, 201);
  } catch (e: any) {
    const msg = String(e?.message || '').toLowerCase();
    if (msg.includes('unique') || msg.includes('constraint')) {
      return json({ success: false, error: 'Category id or name already exists' }, 409);
    }
    return json({ success: false, error: e?.message || 'Failed to create category' }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.DB) return json({ success: false, error: 'DB binding missing (DB)' }, 500);

    const url = new URL(request.url);
    const id = str(url.searchParams.get('id'));
    if (!id) return json({ success: false, error: 'Missing id' }, 400);

    const used = await env.DB
      .prepare(`SELECT COUNT(1) as c FROM products WHERE category_id=?`)
      .bind(id)
      .first<any>();

    if (used?.c && Number(used.c) > 0) {
      return json({ success: false, error: 'Cannot delete: category is used by products' }, 409);
    }

    await env.DB.prepare(`DELETE FROM categories WHERE id=?`).bind(id).run();
    return json({ success: true });
  } catch (e: any) {
    return json({ success: false, error: e?.message || 'Failed to delete category' }, 500);
  }
};
