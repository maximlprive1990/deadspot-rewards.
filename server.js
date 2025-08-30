// server.js
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Admin avec la clé secrète (service_role / Enterprise)
const SUPABASE_URL = 'https://wbavwtwslofcrpeuyqak.supabase.co';
const SUPABASE_SERVICE_KEY = 'ES_6253e974d01348248aea126564d6de51';
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Endpoint pour récupérer l'état utilisateur
app.post('/api/loadUserState', async (req, res) => {
  const { userId } = req.body;
  if(!userId) return res.status(400).json({ error: 'userId manquant' });

  const { data, error } = await supabaseAdmin.from('user_state').select('*').eq('id', userId).single();
  if(error) return res.status(500).json({ error: error.message });

  res.json({ state: data || null });
});

// Endpoint pour sauvegarder l'état utilisateur
app.post('/api/saveUserState', async (req, res) => {
  const { userId, state } = req.body;
  if(!userId || !state) return res.status(400).json({ error: 'Paramètres manquants' });

  const { data, error } = await supabaseAdmin.from('user_state').upsert({ id:userId, ...state });
  if(error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
