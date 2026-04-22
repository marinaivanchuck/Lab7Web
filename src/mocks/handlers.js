import { http, HttpResponse } from 'msw';

const STORAGE_KEY = 'inventory_mock_data';

const getInitialInventory = () => [
  {
    id: '1',
    inventory_name: 'Ноутбук Dell XPS',
    description: '15-дюймовий, 32GB RAM, 1TB SSD, ідеальний для розробки',
    photo: null,
  },
  {
    id: '2',
    inventory_name: 'Проєктор Epson',
    description: 'Full HD, 3500 люмен, HDMI',
    photo: null,
  },
];

const loadInventory = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const initial = getInitialInventory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveInventory = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 6);

const getPlaceholderImage = () => {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8"%3ENo Image%3C/text%3E%3C/svg%3E';
};

export const handlers = [
  http.get('/inventory', () => {
    const inventory = loadInventory();
    return HttpResponse.json(inventory);
  }),

  http.get('/inventory/:id', ({ params }) => {
    const inventory = loadInventory();
    const item = inventory.find(i => i.id === params.id);
    if (!item) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(item);
  }),

  http.get('/inventory/:id/photo', ({ params }) => {
    const inventory = loadInventory();
    const item = inventory.find(i => i.id === params.id);
    let imageData = item?.photo || getPlaceholderImage();
    return new HttpResponse(imageData, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }),

  http.post('/register', async ({ request }) => {
    const formData = await request.formData();
    const inventory_name = formData.get('inventory_name');
    const description = formData.get('description');
    const photoFile = formData.get('photo');
    
    if (!inventory_name) {
      return new HttpResponse(JSON.stringify({ error: 'Назва обов\'язкова' }), { status: 400 });
    }
    
    let photoBase64 = null;
    if (photoFile && photoFile.size > 0) {
      const buffer = await photoFile.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      photoBase64 = `data:${photoFile.type};base64,${base64}`;
    }
    
    const newItem = {
      id: generateId(),
      inventory_name,
      description: description || '',
      photo: photoBase64,
    };
    
    const inventory = loadInventory();
    inventory.push(newItem);
    saveInventory(inventory);
    
    return HttpResponse.json(newItem, { status: 201 });
  }),

  http.put('/inventory/:id', async ({ params, request }) => {
    const updates = await request.json();
    const inventory = loadInventory();
    const index = inventory.findIndex(i => i.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    inventory[index] = {
      ...inventory[index],
      inventory_name: updates.inventory_name ?? inventory[index].inventory_name,
      description: updates.description ?? inventory[index].description,
    };
    saveInventory(inventory);
    return HttpResponse.json(inventory[index]);
  }),

  http.put('/inventory/:id/photo', async ({ params, request }) => {
    const formData = await request.formData();
    const photoFile = formData.get('photo');
    
    if (!photoFile || photoFile.size === 0) {
      return new HttpResponse(JSON.stringify({ error: 'Файл не обрано' }), { status: 400 });
    }
    
    const buffer = await photoFile.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const photoBase64 = `data:${photoFile.type};base64,${base64}`;
    
    const inventory = loadInventory();
    const index = inventory.findIndex(i => i.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    inventory[index].photo = photoBase64;
    saveInventory(inventory);
    
    return HttpResponse.json({ message: 'Photo updated' });
  }),

  http.delete('/inventory/:id', ({ params }) => {
    const inventory = loadInventory();
    const filtered = inventory.filter(i => i.id !== params.id);
    if (filtered.length === inventory.length) {
      return new HttpResponse(null, { status: 404 });
    }
    saveInventory(filtered);
    return new HttpResponse(null, { status: 204 });
  }),
];