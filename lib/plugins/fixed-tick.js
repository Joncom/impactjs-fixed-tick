ig.module( 'plugins.fixed-tick' )
.requires(
    'impact.system',
    'impact.game',
    'impact.timer'
)
.defines(function(){ "use strict";

    ig.System.inject({

        _delta: 0, // accumulates time for scheduling game updates
        _lastRun: 0, // timestamp run() was last called
        tickRate: 60,

        startRunLoop: function() {
            this.parent();

            // forget about any time that elapsed while the run loop was stopped
            this._lastRun = performance.now();
        },

        run: function() {
            var timestamp = performance.now();

            // Track the accumulated time that hasn't been simulated yet
            this._delta += timestamp - this._lastRun;
            this._lastRun = timestamp;

            // Simulate the total elapsed time in fixed-size chunks
            var count = 0;
            var timestep = 1000 / this.tickRate;
            while( this._delta >= timestep ) {
                ig.Timer.step();
                this.tick = this.clock.tick();

                this.delegate.update();
                ig.input.clearPressed();

                this._delta -= timestep;

                // Sanity check
                if( ++count >= 240 ) {
                    this.delegate.panic(); // fix things
                    break; // bail out
                }
            }

            this.delegate.draw();

            if( this.newGameClass ) {
                this.setGameNow(this.newGameClass);
                this.newGameClass = null;
            }
        },

        setDelegate: function( object ) {
            if( typeof( object.update ) !== 'function' ) {
                throw( 'System.setDelegate: No update() function in object' );
            }
            if( typeof( object.draw ) !== 'function' ) {
                throw( 'System.setDelegate: No draw() function in object' );
            }
            this.delegate = object;
            this.startRunLoop();
        }
    });

    ig.Game.inject({
        run: function() {
            throw( 'Game.run: Should never be called when using fixed tick plugin' );
        },

        // "spiral of death" handler, called if are updates not terminating fast enough
        panic: function() {
            throw( 'Game panicked!' );
        }
    });

    ig.Timer.step = function() {
        var ms = ( 1000 / ig.system.tickRate );
        var seconds = ( ms / 1000 );
        ig.Timer.time += seconds * ig.Timer.timeScale;
    };

});