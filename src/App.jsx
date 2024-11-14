import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [suggestedNames, setSuggestedNames] = createSignal([]);
  const [savedNames, setSavedNames] = createSignal([]);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchSavedNames = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/getNames', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSavedNames(data);
      } else {
        console.error('Error fetching saved names:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching saved names:', error);
    }
  };

  const handleGenerateNames = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Suggest 10 unique and beautiful names for a child in JSON format as: { "names": ["name1", "name2", ...] }',
        response_type: 'json'
      });
      setSuggestedNames(result.names || []);
    } catch (error) {
      console.error('Error generating names:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveName = async (name) => {
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/saveName', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        setSavedNames([...savedNames(), { name }]);
      } else {
        console.error('Error saving name');
      }
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  createEffect(() => {
    if (!user()) return;
    fetchSavedNames();
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-pink-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-pink-600">Name My Child</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="mb-8">
            <button
              class={`px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleGenerateNames}
              disabled={loading()}
            >
              {loading() ? 'Generating Names...' : 'Generate Names'}
            </button>
          </div>

          <Show when={suggestedNames().length > 0}>
            <div class="mb-8">
              <h2 class="text-2xl font-bold mb-4 text-pink-600">Suggested Names</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <For each={suggestedNames()}>
                  {(name) => (
                    <div class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                      <span class="text-lg text-gray-800">{name}</span>
                      <button
                        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        onClick={() => saveName(name)}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>

          <Show when={savedNames().length > 0}>
            <div>
              <h2 class="text-2xl font-bold mb-4 text-pink-600">My Saved Names</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <For each={savedNames()}>
                  {(item) => (
                    <div class="bg-white p-4 rounded-lg shadow-md">
                      <span class="text-lg text-gray-800">{item.name}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;