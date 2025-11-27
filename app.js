// app.js - FIXED PATHS
const express = require('express');
const mqttClient = require('./mqtt');
const RealKenyaNeuralMPC = require('./neural-mpc');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const neuralMPC = new RealKenyaNeuralMPC();

// MPC COMPARISON API ROUTES
app.get('/api/mpc/compare', async (req, res) => {
    try {
        console.log('🧠 MPC Comparison Request');
        const results = await neuralMPC.runCompleteSystem();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/mpc/status', async (req, res) => {
    const status = {
        system: 'active',
        mpc_algorithms: ['HE-NMPC', 'Standard-MPC', 'MixedInteger-MPC', 'Stochastic-MPC', 'HEMPC'],
        data_sources: {
            weather: 'active',
            electricity: 'active', 
            hospital: 'active'
        },
        timestamp: new Date().toISOString()
    };
    res.json(status);
});

// Serve main dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve MPC Comparison Dashboard
app.get('/mpc-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mpc-dashboard.html'));
});

// Serve API status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'KNH MPC System Running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🏥 KNH MPC System running on port ${PORT}`);
    console.log(`🌐 Main Dashboard: http://localhost:${PORT}/`);
    console.log(`📊 MPC Dashboard: http://localhost:${PORT}/mpc-dashboard`);
    console.log(`🔧 API Status: http://localhost:${PORT}/api/status`);
    
    // Connect MQTT
    mqttClient.connect();
});
