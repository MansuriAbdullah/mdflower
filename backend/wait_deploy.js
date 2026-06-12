async function waitDeploy() {
  const healthUrl = 'https://mdflower-qvjl.vercel.app/api/health';
  const productsUrl = 'https://mdflower-qvjl.vercel.app/api/products';
  
  console.log('Waiting for Vercel deployment to update...');
  for (let i = 1; i <= 20; i++) {
    try {
      const res = await fetch(healthUrl);
      const data = await res.json();
      console.log(`Poll #${i}: status = ${res.status}, apiVersion = ${data.apiVersion || 'old-version'}`);
      
      if (data.apiVersion === 'v3-connection-middleware') {
        console.log('\nSUCCESS: New code is active on Vercel!');
        
        // Let's test the products GET endpoint to make sure it loads successfully now
        console.log('Testing GET products...');
        const prodRes = await fetch(productsUrl);
        console.log('GET products status:', prodRes.status);
        if (prodRes.status === 200) {
          const products = await prodRes.json();
          console.log(`Successfully fetched ${products.length} products!`);
        } else {
          const errText = await prodRes.text();
          console.log('Error data:', errText);
        }
        return;
      }
    } catch (err) {
      console.log(`Poll #${i} Error:`, err.message);
    }
    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  console.log('Timeout waiting for deployment.');
}

waitDeploy();
