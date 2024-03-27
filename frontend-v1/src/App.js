import React, { useState, useEffect } from 'react';

function App() {
  const [details, setDetails] = useState('Loading...');
  const [detailsVersion, setDetailsVersion] = useState('Pending...');
  const [balance, setBalance] = useState('Loading...');
  const [balanceVersion, setBalanceVersion] = useState('Pending...');
  const [transaction, setTransaction] = useState('Loading...');
  const [transactionsVersion, setTransactionsVersion] = useState('Pending...');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch('/api/details');
        const headerData = response.headers;
        const jsonData = await response.json();
        setDetailsVersion(headerData.get('version') || 'unknown');
        setDetails(jsonData.data);
      } catch (error) {
        setDetailsVersion('Error...')
        setDetails('Error fetching data...');
      }
    };
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/balance');
        const headerData = response.headers;
        const jsonData = await response.json();
        setBalanceVersion(headerData.get('version') || 'unknown');
        setBalance(jsonData.data);
      } catch (error) {
        setBalanceVersion('Error...')
        setBalance('Error fetching data...');
      }
    };
    const fetchTransaction = async () => {
      try {
        const response = await fetch('/api/transactions');
        const headerData = response.headers;
        const jsonData = await response.json();
        setTransactionsVersion(headerData.get('version') || 'unknown');
        setTransaction(jsonData.data);
      } catch (error) {
        setTransactionsVersion('Error...')
        setTransaction('Error fetching data...');
      }
    };

    fetchDetails();
    fetchBalance();
    fetchTransaction();
  }, []);

  return (
    <div className="App" style={{padding: '30px'}}>
      <div style={{margin: '30px'}}>
        <h1>HDFZ</h1>
      </div>
      <div style={{margin: '30px'}}>
        Details <small>({detailsVersion})</small>:
        <br/>
        {typeof details === 'string' ? details : Object.keys(details).map((key, index) => (
          <div key={index}>
            {index + 1}. {key}: {details[key]}
          </div>
        ))}
      </div>
      <div style={{margin: '30px'}}>Balance <small>({balanceVersion})</small>: {balance}</div>
      <div style={{margin: '30px'}}>
        Transactions <small>({transactionsVersion})</small>:
        <br/>
        {typeof transaction === 'string' ? transaction : transaction.map((item, index) => (
          <div key={index}>
            {index + 1}. {item}
          </div>
        ))}
      </div>
      <div style={{margin: '30px'}}>
        <small>Version: v1</small>
      </div>
    </div>
  );
}

export default App;
