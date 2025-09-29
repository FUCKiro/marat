# Automazione Make per Calcolo Totali Mensili Pazienti

## 📋 Panoramica
Questa automazione Make prende il file Excel delle visite esportato dall'applicazione e lo confronta con un file dei prezzi delle terapie per calcolare automaticamente il totale mensile per ogni paziente.

## 📊 Formato File Excel Visite (Generato dall'App)

### Foglio "Riepilogo"
- **Paziente**: Nome del paziente
- **Email**: Email del paziente  
- **Ore Totali**: Ore totali del mese
- **Ore Psicoterapia**: Ore di psicoterapia
- **Ore Psicoeducazione**: Ore di psicoeducazione
- **Ore ABA**: Ore di ABA
- **Ore Logopedia**: Ore di logopedia
- **Ore Neuropsicomotricità**: Ore di neuropsicomotricità
- **Ore Gruppo**: Ore di gruppo
- **Ore GLO**: Ore GLO
- **Numero Visite**: Totale visite
- **Tipologie**: Tipologie di terapie
- **Operatori**: Operatori coinvolti

### Foglio "Dettaglio Visite"
- **Data**: Data della visita
- **Paziente**: Nome paziente
- **Email Paziente**: Email paziente
- **Tipologia**: Tipo di terapia
- **Operatore**: Nome operatore
- **Durata (minuti)**: Durata in minuti
- **Durata (ore)**: Durata in ore

## 💰 Template Prezzi Terapie

Il file `template_prezzi_terapie.xlsx` contiene:
- **Tipologia**: Nome della terapia
- **Prezzo_Orario**: Prezzo per ora
- **Note**: Note aggiuntive

### Prezzi Standard:
- Psicoterapia: €60/ora
- Psicoeducazione: €50/ora
- ABA: €65/ora
- Logopedia: €55/ora
- Neuropsicomotricità: €60/ora
- Gruppo: €40/ora
- GLO: €45/ora

## 🔧 Scenario Make - Configurazione

### Moduli Necessari:
1. **Watch Files** - Monitora cartella per nuovi file Excel visite
2. **Excel Parser** - Legge il file delle visite
3. **Excel Parser** - Legge il file dei prezzi
4. **Iterator** - Itera sui pazienti
5. **Math Operations** - Calcola i totali
6. **Excel Creator** - Crea file risultato
7. **Email** - Invia report (opzionale)

### Configurazione Dettagliata:

#### 1. Watch Files
- **Cartella**: `/path/to/visite/exports/`
- **Filtro**: `*.xlsx`
- **Pattern nome**: `Visite_*_*.xlsx`

#### 2. Excel Parser (File Visite)
- **Foglio**: "Riepilogo"
- **Prima riga**: Header
- **Colonne da leggere**: Tutte

#### 3. Excel Parser (File Prezzi)
- **File**: `template_prezzi_terapie.xlsx`
- **Foglio**: "Sheet1"
- **Prima riga**: Header

#### 4. Iterator
- **Array**: Righe del foglio "Riepilogo"

#### 5. Math Operations (per ogni paziente)
```javascript
// Calcolo totale per paziente
let totale = 0;

// Mappa prezzi per tipologia
const prezzi = {
  'Psicoterapia': 60,
  'Psicoeducazione': 50,
  'ABA': 65,
  'Logopedia': 55,
  'Neuropsicomotricità': 60,
  'Gruppo': 40,
  'GLO': 45
};

// Calcola per ogni tipologia
totale += parseFloat({{ore_psicoterapia}}) * prezzi['Psicoterapia'];
totale += parseFloat({{ore_psicoeducazione}}) * prezzi['Psicoeducazione'];
totale += parseFloat({{ore_aba}}) * prezzi['ABA'];
totale += parseFloat({{ore_logopedia}}) * prezzi['Logopedia'];
totale += parseFloat({{ore_neuropsicomotricita}}) * prezzi['Neuropsicomotricità'];
totale += parseFloat({{ore_gruppo}}) * prezzi['Gruppo'];
totale += parseFloat({{ore_glo}}) * prezzi['GLO'];

return totale.toFixed(2);
```

#### 6. Aggregator
- **Tipo**: Array
- **Raggruppa**: Tutti i risultati dei calcoli

#### 7. Excel Creator
- **Nome file**: `Fatturazione_[MESE]_[ANNO].xlsx`
- **Colonne**:
  - Paziente
  - Email
  - Ore Totali
  - Importo Totale €
  - Dettaglio per Tipologia
  - Data Elaborazione

## 📈 Output Finale

Il file Excel generato conterrà:

### Foglio "Fatturazione Mensile"
| Paziente | Email | Ore Totali | Importo Totale € | Psicoterapia € | ABA € | Logopedia € | ... |
|----------|-------|------------|------------------|----------------|-------|-------------|-----|
| Mario Rossi | mario@email.com | 8.50 | 510.00 | 360.00 | 130.00 | 110.00 | ... |

### Foglio "Riepilogo Generale"
- Totale pazienti elaborati
- Importo totale mensile
- Ore totali erogate
- Distribuzione per tipologia

## 🚀 Implementazione Step-by-Step

### Fase 1: Setup Iniziale
1. Crea nuovo scenario Make
2. Configura trigger "Watch Files"
3. Testa con file di esempio

### Fase 2: Parsing Dati
1. Aggiungi modulo Excel Parser per visite
2. Aggiungi modulo Excel Parser per prezzi
3. Testa lettura dati

### Fase 3: Logica Calcolo
1. Aggiungi Iterator per pazienti
2. Implementa Math Operations
3. Testa calcoli con dati reali

### Fase 4: Output
1. Configura Excel Creator
2. Definisci formato output
3. Testa generazione file

### Fase 5: Automazione
1. Attiva scenario
2. Testa con file reale
3. Configura notifiche

## 🔍 Formule Excel Alternative

Se preferisci usare Excel direttamente:

```excel
// In colonna "Totale Paziente"
=SUMPRODUCT(
  (B2*VLOOKUP("Psicoterapia",Prezzi!A:B,2,0)) +
  (C2*VLOOKUP("Psicoeducazione",Prezzi!A:B,2,0)) +
  (D2*VLOOKUP("ABA",Prezzi!A:B,2,0)) +
  (E2*VLOOKUP("Logopedia",Prezzi!A:B,2,0)) +
  (F2*VLOOKUP("Neuropsicomotricità",Prezzi!A:B,2,0)) +
  (G2*VLOOKUP("Gruppo",Prezzi!A:B,2,0)) +
  (H2*VLOOKUP("GLO",Prezzi!A:B,2,0))
)
```

## 📧 Notifiche Automatiche

Configura email automatiche con:
- Report mensile allegato
- Riepilogo importi
- Alert per anomalie
- Conferma elaborazione

## 🛠️ Troubleshooting

### Errori Comuni:
1. **File non trovato**: Verifica path cartella
2. **Formato non riconosciuto**: Controlla estensione file
3. **Calcoli errati**: Verifica mapping prezzi
4. **Encoding problemi**: Usa UTF-8

### Monitoraggio:
- Log elaborazioni
- Alert errori
- Backup file processati
- Storico calcoli

## 📋 Checklist Pre-Produzione

- [ ] Test con file reale
- [ ] Verifica calcoli manuali
- [ ] Backup scenario
- [ ] Documentazione aggiornata
- [ ] Notifiche configurate
- [ ] Permessi cartelle
- [ ] Schedule definito
- [ ] Error handling attivo