const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const API_KEY = 'vlFDBVFn6gUMf9JKcg8YcVN1db22'; // Replace with your AppyFlow key

app.use(cors());
app.use(bodyParser.json());

app.post('/api/verify', async (req, res) => {
  const { gstNo } = req.body;

  if (!gstNo || gstNo.length !== 15) {
    return res.status(400).json({ error: true, message: 'Invalid GST number' });
  }

  try {
    const apiResponse = await axios.get('https://appyflow.in/api/verifyGST', {
      params: { gstNo, key_secret: API_KEY }
    });

    const data = apiResponse.data;
    const taxpayer = data.taxpayerInfo || {};
    const pradr = taxpayer.pradr || {};
    const addr = pradr.addr || {};
    const filing = data.filing || [];
    const compliance = data.compliance || {};

    res.json({
      gstin: taxpayer.gstin || '',
      legalName: taxpayer.lgnm || '',
      tradeName: taxpayer.tradeNam || '',
      status: taxpayer.sts || '',
      constitutionOfBusiness: taxpayer.ctb || '',
      dateOfRegistration: taxpayer.rgdt || '',
      lastUpdated: taxpayer.lstupdt || '',
      typeOfTaxpayer: taxpayer.dty || '',
      jurisdiction: taxpayer.ctj || '',
      jurisdictionCode: taxpayer.ctjCd || '',
      stateJurisdiction: taxpayer.stj || '',
      stateJurisdictionCode: taxpayer.stjCd || '',
      natureOfBusiness: pradr.ntr || '',
      filingFrequency: compliance.filingFrequency || '',
      lastReturnFiled: filing[0]?.rtnprd || '',
      address: {
        buildingNo: addr.bno || '',
        street: addr.st || '',
        locality: addr.loc || '',
        district: addr.dst || '',
        state: addr.stcd || '',
        pincode: addr.pncd || '',
        flatNo: addr.flno || '',
        landmark: addr.lg || '',
        buildingName: addr.bnm || '',
        city: addr.city || '',
        latitude: addr.lt || ''
      }
    });

  } catch (error) {
    console.error('GST API Error:', error.response?.data || error.message);
    res.status(500).json({ error: true, message: 'Failed to fetch GST details' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GST Verifier backend running at http://localhost:${PORT}`);
});