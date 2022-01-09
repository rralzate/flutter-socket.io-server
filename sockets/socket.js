const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band( 'Qeen' ));
bands.addBand( new Band( 'Bon Jovi' ));
bands.addBand( new Band( 'Metallica' ));
bands.addBand( new Band( 'Soda estereo' ));

console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {   
    
    console.log('Cliente conectado');

    client.emit('bandas-activas', bands.getBands())

    client.on('disconnect', () => { 
        console.log('Cliente desconectado'); 
    });

    client.on('mensaje',  ( payload ) => {
        console.log('mensaje!!!', payload);

        io.emit('mensaje', {admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', (payload) => {

        console.log(payload);
        bands.voteBand(payload.id);
        io.emit('bandas-activas', bands.getBands());
       // client.broadcast.emit('nuevo-mensaje', payload); //Emite a todos menos al cliente

    });

    client.on('add-band',  ( payload ) => {   
        
        const newBand = new Band( payload.name );
        bands.addBand(newBand);
        io.emit('bandas-activas', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        
        bands.deleteBand(payload.id);
        io.emit('bandas-activas', bands.getBands());       

    });
    


    // client.on('emitir-mensaje', (payload) => {

    //     console.log(payload);
    //    // io.emit('nuevo-mensaje', payload);
    //     client.broadcast.emit('nuevo-mensaje', payload); //Emite a todos menos al cliente

    // });


  });
