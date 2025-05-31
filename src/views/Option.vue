<!-- Ce que j'affiche -->

<template>
  <div class="option roboto">
    <h1>Bureau de change XPF</h1>
    <div>
      <input type="number" placeholder="Entrez le montant en XPF" v-model.number="amount" min="0" step="1" class="styled-input roboto"/>
    </div>
    <p class="miseAJour roboto">Dernière mise à jour : {{ lastUpdated }}</p>
    <transition-group name="fade" tag="section" class="container roboto" v-if="paysCodes && rates">
      <section v-for="currency in paysSelectionnes" :key="currency" class="currency-item roboto">
        <div class="paysInfo roboto">
          <img :src="'https://flagcdn.com/40x30/' + paysAttendus(currency).toLowerCase() + '.png'" alt="flag" class="flag roboto" /> {{ nomPays(currency) }}
        </div>
        <div class="converted-amount roboto">{{ rates ? convertCurrency(rates[currency]) : 'Loading...' }}</div>
        <div class="currency-code roboto">{{ currency }}</div>
      </section>
    </transition-group>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rates: null,
        // Les pays que je veux dans mon API
        paysSelectionnes: ['AUD', 'NZD', 'CAD', 'USD', 'FJD', 'SGD', 'THB', 'CHF', 'EUR', 'GBP', 'JPY', 'VUV'],
        amount: 1,
        paysCodes: null,
        lastUpdated: null
      };
    },
    async mounted() {
      await this.fetchpaysCodes();
      await this.fetchRates();
      this.$nextTick(() => {
        this.setMaxCurrencyItemWidth();
      });
      // Mettre à jour les taux de change toutes les heures avec setInterval
      setInterval(this.fetchRates, 3600000);
    },
    watch: {
      paysSelectionnes: 'fetchRates'
    },
    methods: {
      fetchRates() {
        // Mon API taux de change
        fetch('https://v6.exchangerate-api.com/v6/6bb303659f2c72629c050873/latest/XPF')
          .then(response => response.json())
          .then(data => {
            this.rates = Object.fromEntries(
              Object.entries(data.conversion_rates)
                .filter(([currency, rate]) => this.paysSelectionnes.includes(currency))
            );
             this.$nextTick(() => {
               this.setMaxCurrencyItemWidth();
             });
            //  Dernière mise à jour dans l'interface
             this.lastUpdated = new Date().toLocaleString();
          })
          .catch(error => {
            console.error('Erreur de récupération des taux de change:', error);
          });
      },
      fetchpaysCodes() {
        // Mon API pour les drapeaux
        fetch('https://flagcdn.com/en/codes.json')
          .then(response => response.json())
          .then(data => {
            this.paysCodes = data;
          })
          .catch(error => {
            console.error('Erreur de récupération des codes pays:', error);
          });
      },
      convertCurrency(rate) {
        return (this.amount * rate).toFixed(2);
      },
      nomPays(nomMonnaie) {
        const paysCode = this.paysAttendus(nomMonnaie);

        if (paysCode && this.paysCodes && this.paysCodes[paysCode.toLowerCase()]) {
          return this.paysCodes[paysCode.toLowerCase()];
        } else {
          return 'Nom inconnu';
        }
      },
      paysAttendus(nomMonnaie) {
        const pays = {
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
        return pays[nomMonnaie];
      },
      // Me suis aidée de Copilot pour cette partie afin que les items aient la même largeur
      setMaxCurrencyItemWidth() {
        let maxWidth = 0;
        const currencyItems = document.querySelectorAll('.currency-item');
        currencyItems.forEach(item => {
          maxWidth = Math.max(maxWidth, item.offsetWidth);
        });
        currencyItems.forEach(item => {
          item.style.width = `${maxWidth}px`;
        });
      }
    }
  };
</script>

<!-- Mon CSS - Me suis aidée de Copilot pour les parties de CSS que je n'arrivais
     pas forcément à faire tel que le fond qui bouge un peu dans App.vue -->
<style scoped>
  .option {
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