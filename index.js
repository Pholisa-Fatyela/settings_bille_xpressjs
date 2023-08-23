import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import SettingsBill from './public/js/setting-bill.js'; // import the factory function

// Setup a simple ExpressJS server
let app = express();

// Instantiate factory function
const settingsBill = SettingsBill();

// Set port variable
let PORT = process.env.PORT || 3011;

// Setup handlebars
const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

// Make public folder available to the app
app.use(express.static('public'));

// Setup body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false}))
// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index', {
        // setup the handlebars for reference in the html template
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        warningLevelReached: settingsBill.hasReachedWarningLevel(),
        criticalLevelReached: settingsBill.hasReachedCriticalLevel()
    });
});
// * Settings Section
app.post('/settings', function(req, res){
    // set the entered values in the factory function
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })

    // Check that the settings updated correctly
    console.log(settingsBill.getSettings());

    // Redirect back to root (home)
    res.redirect('/')
});

app.post('/action', function(req, res){

    // Capture the call type to add
    settingsBill.recordAction(req.body.actionType);
    // settingsBill.hasReachedWarningLevel();
    // settingsBill.hasReachedCriticalLevel();
    // Redirect back to root (home)
    res.redirect('/')
});

app.get('/actions', function(req, res){
    res.render('actions', {
        actions: settingsBill.actions()
    });
});

app.get('/actions/:actionType', function(req,res){
    const actionType = req.params.actionType
    res.render('actions', {
        actions: settingsBill.actionsFor(actionType)
    });
})

app.listen(PORT, function(){
    console.log('App starting on port', PORT);
});