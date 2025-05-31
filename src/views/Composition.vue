<!-- Ce que j'affiche -->

<template>
  <div class="composition roboto">
    <h1>Bureau de change XPF</h1>
    <div>
      <input type="number" placeholder="Entrez le montant en XPF" v-model.number="amount" min="0" step="1" class="styled-input roboto" autocomplete="off" />
    </div>
    <p class="miseAJour roboto">Dernière mise à jour : {{ lastUpdated }}</p>
    <transition-group name="fade" tag="section" class="container roboto">
      <section v-for="(rate, currency) in filteredRates" :key="currency" class="currency-item roboto">
        <div class="paysInfo roboto">
          <img :src="'https://flagcdn.com/40x30/' + paysAttendus(currency).toLowerCase() + '.png'" alt="flag" class="flag roboto" /> {{ nomPays(currency) }}
        </div>
        <div class="converted-amount roboto">{{ convertCurrency(rate) }}</div>
        <div class="currency-code roboto">{{ currency }}</div>
      </section>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const amount = ref(1);
const rates = ref(null);
const lastUpdated = ref('');
const paysSelectionnes = ['AUD', 'NZD', 'CAD', 'USD', 'FJD', 'SGD', 'THB', 'CHF', 'EUR', 'GBP', 'JPY', 'VUV'];
const paysCodes = ref({});

const filteredRates = computed(() => {
  if (!rates.value) {
    return {};
  }
  const filtered = {};
  paysSelectionnes.forEach(currency => {
    if (rates.value[currency]) {
      filtered[currency] = rates.value[currency];
    }
  });
  return filtered;
});

const fetchRates = async () => {
  try {
    // Mon API taux de change
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/XPF');
    const data = await res.json();
    rates.value = data.rates;
    lastUpdated.value = new Date().toLocaleString('fr-FR');
     await fetchCountryCodes();
  } catch (error) {
    console.error('Erreur de récupération des taux :', error);
  }
};

const fetchCountryCodes = async () => {
  try {
    // Mon API pour les drapeaux
    const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name');
    const data = await response.json();
    const codes = {};
    data.forEach(country => {
      codes[country.cca2.toLowerCase()] = country.name.common;
    });
    paysCodes.value = codes;
  } catch (error) {
    console.error('Error fetching country codes:', error);
  }
};

const convertCurrency = (rate) => {
  return (rate * amount.value).toFixed(2);
};

const paysAttendus = (currency) => {
  const flags = {
    'AUD': 'AU',
    'NZD': 'NZ',
    'CAD': 'CA',
    'USD': 'US',
    'FJD': 'FJ',
    'SGD': 'SG',
    'CHF': 'CH',
    'EUR': 'EU',
    'GBP': 'GB',
    'JPY': 'JP',
    'VUV': 'VU',
    'THB': 'TH'
  };
  return flags[currency] || currency.toLowerCase();
};

const nomPays = (nomMonnaie) => {
  const paysCode = paysAttendus(nomMonnaie);

  if (paysCode && paysCodes.value && paysCodes.value[paysCode.toLowerCase()]) {
    return paysCodes.value[paysCode.toLowerCase()];
  } else {
    return 'Nom inconnu';
  }
};

// Me suis aidée de Copilot pour cette partie afin que les items aient la même largeur
const setMaxCurrencyItemWidth = () => {
  let maxWidth = 0;
  const currencyItems = document.querySelectorAll('.currency-item');
  currencyItems.forEach(item => {
    maxWidth = Math.max(maxWidth, item.offsetWidth);
  });
  currencyItems.forEach(item => {
    item.style.width = `${maxWidth}px`;
  });
};

onMounted(async () => {
  await fetchRates();
  setMaxCurrencyItemWidth();
});
</script>

<!-- Mon CSS - Me suis aidée de Copilot pour les parties de CSS que je n'arrivais
     pas forcément à faire tel que le fond qui bouge un peu dans App.vue -->
<style scoped>
  .composition {
    color: #fff;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    padding: 0 150px;
  }

  .currency-item {
    display: grid;
    grid-template-columns: 4fr 1fr auto;
    grid-template-rows: auto;
    align-items: center;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5));
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .paysInfo {
    display: flex;
    align-items: center;
    margin-right: 10px;
    grid-column: 1;
  }

  .flag {
    margin-right: 5px;
    vertical-align: middle;
  }

  .currency-code {
    text-align: left;
    font-weight: bold;
    grid-column: 3;
  }
  .exchange-rate {
    text-align: left;
    margin-right: 10px;
  }
  .converted-amount {
    text-align: left;
    font-weight: bold;
    grid-column: 2;
  }

  /* Partie responsive */
  @media (max-width: 600px) {
    .currency-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .currency-code,
    .exchange-rate,
    .converted-amount {
      text-align: left;
    }
  }

  .styled-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto 20px auto;
    display: block;
  }

  .styled-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  h1 {
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-style: normal;
  }

  .roboto {
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-variation-settings: "wdth" 100;
  }

  .miseAJour {
    text-align: center;
    margin-bottom: 10px;
    font-size: 0.8em;
    color: #ccc;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>