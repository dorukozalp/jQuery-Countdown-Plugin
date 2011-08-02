/*
 *  
 *  Custom Countdown Plugin v0.1
 *  
 *  @requires jQuery v1.6.1
 *   
 *  Apache License 2.0
 *  http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  @author Doruk Ozalp
 *  @date 2011/07/31
 */

//Create Closure
(function($) {
	
  //Define Plugin
  $.fn.customCountdown = function( method ) {
	  
	var PLUGIN_NAMESPACE = 'customCountdown', 
		PLUGIN_DEFAULTS = {
			 debug: false,
			 start: 300, //seconds
			 interval: 1, //seconds
			 countdownContainer: 'countDownContainer',
			 minuteContainer: 'span',
			 minuteContainerId: 'minute',
			 secondsContainer: 'span',
			 secondsContainerId: 'second',
			 bracketContainer: 'span',
			 bracketContainerId: 'bracket',
			 brackets: ":",
			 //CallBack Function
			 onStart: function(){},
			 onStop: function(){},
			 onPause: function(){}
	   	},
	   	COUNTDOWN_STARTED = 'STARTED',
	   	COUNTDOWN_PAUSED = 'PAUSED',
	   	COUNTDOWN_STOPPED = 'STOPPED',
	   	Document = $(document),
	   	$this = this,
		debug = function($obj) {
			  if($this.data('opts').debug === true){
	  		 	  try{
	  				  if (window.console && window.console.log){
	  					  window.console.log($obj);
	  				  }
	  			  }
	  			  catch(err){
	  			 	  
	  			  }
	  		  }
		},
		debugTime = function($obj) {
	  		if($this.data('opts').debug === true){
	  			try{
				  if (window.console && window.console.time){
					  window.console.time($obj);
					  window.console.log($obj + ' Started!');
				  }
	  			}
	  			catch(err){
	  				
	  			}	
			}
		},
		debugTimeEnd = function($obj) {
			if($this.data('opts').debug === true){
	  			try{
	  				  if (window.console && window.console.time){
	  					  window.console.timeEnd($obj);
	  					  window.console.log($obj + ' Finished!');
	  				  }
	  			  }
	  			  catch(err){
	  			 	  
	  			  }
	  		}
		},
		calculateMinutes = function(m){
			var minutes = parseInt(m / 60);
			
			if(minutes < 10){
				minutes = "0" + minutes;
			}
			
			return minutes;  
		},
		calculateSeconds = function(s){
			var seconds = parseInt(s % 60);
			
			if(seconds < 10){
				seconds = "0" + seconds;
			}
			
			return seconds;  
		},
		methods = {
		init : function( options ){
			
			return this.each(function(){
				
				$this = $(this);
				
				$this.data('opts', $.extend({}, PLUGIN_DEFAULTS, options));
				
					var opts = $this.data('opts');
					
					debugTime('init');
					
					if($this.data('state') == COUNTDOWN_STARTED){
						debug("Countdown is already started!");
						debugTimeEnd('init');
						return false;
					}
					
					var	minutes = calculateMinutes(opts.start),
						seconds = calculateSeconds(opts.start);
					
					//SET PLUGIN NAMESPACE DATA
					$this.data(PLUGIN_NAMESPACE, {
						'minutes': minutes,
						'seconds': seconds,
						'start' : opts.start,
						'current' : opts.start,
						'minuteId' : PLUGIN_NAMESPACE + "-" + opts.minuteContainerId,
						'secondsId': PLUGIN_NAMESPACE + "-" + opts.secondContainerId,
						'bracketId': PLUGIN_NAMESPACE + "-" + opts.bracketContainerId,
						'object' : {}
				    });
					//SET PLUGIN NAMESPACE DATA
					
					debug("Minutes :" + minutes);
					debug("Seconds :" + seconds);
					
					$('#' + opts.countdownContainer).html(
						'<' + opts.minuteContainer + ' id="'+ $this.data(PLUGIN_NAMESPACE).minuteId + '">' + minutes + '</' + opts.minuteContainer + '>' +
						'<' + opts.bracketContainer + ' id="'+ $this.data(PLUGIN_NAMESPACE).bracketId + '">' + opts.brackets + '</' + opts.bracketContainer + '>' + 
						'<' + opts.secondsContainer + ' id="'+ $this.data(PLUGIN_NAMESPACE).secondsId + '">' + seconds + '</' + opts.secondsContainer + '>'
					);
					 
					debugTimeEnd('init');
					 
					$(this).customCountdown('start');
			});
		},
		start : function( options ){
			
			if(typeof($this.data(PLUGIN_NAMESPACE)) === 'undefined'){
				return false;
			}
			
			debugTime('Start');
			
			if($this.data('state') == COUNTDOWN_STARTED){
				debug("Countdown is already started!");
				debugTimeEnd('Start');
				return false;
			}
			
			$this.data('state', COUNTDOWN_STARTED);
			
			var  $data = $this.data(PLUGIN_NAMESPACE),
			 	 opts = $this.data('opts');
			
			$data.object = setInterval(function(){
				$data.current = $data.current - opts.interval;
				
				$data.minutes = calculateMinutes($data.current);
				$data.seconds = calculateSeconds($data.current);
				
				debug("Minutes :" + $data.minutes);
				debug("Seconds :" + $data.seconds);
				
				$('#' + $data.minuteId).html($data.minutes);
				$('#' + $data.secondsId).html($data.seconds);
				
				if($data.current <= 0){
					$this.customCountdown('stop');
				}
				
			}, opts.interval * 1000);
			
			//Callback For Start
			opts.onStart.apply();
					
			debugTimeEnd('Start');
		},
		stop : function(){
			
			if(typeof($this.data(PLUGIN_NAMESPACE)) === 'undefined'){
				return false;
			}
			
			debugTime('Stop');
			
			if($this.data('state') !== COUNTDOWN_STARTED){
				debug("Countdown is not started!");
				debugTimeEnd('Stop');
				return false;
			}
			
			var  $data = $this.data(PLUGIN_NAMESPACE),
				 opts = $this.data('opts');
			
			clearInterval($data.object);
			
			$this.data('state', COUNTDOWN_STOPPED);
		
			//Callback For Stop
			opts.onStop.apply();
					
			debugTimeEnd('Stop');
		},
		pause : function(){
			
			if(typeof($this.data(PLUGIN_NAMESPACE)) === 'undefined'){
				return false;
			}
			
			debugTime('Pause');
			
			if($this.data('state') == COUNTDOWN_STOPPED){
				debug("Countdown is not started!");
				debugTimeEnd('Pause');
				return false;
			}
			
			var  $data = $this.data(PLUGIN_NAMESPACE),
		 	 	 opts = $this.data('opts');
			
			$this.customCountdown('stop');
			
			if($this.data('state') == COUNTDOWN_PAUSED){
				$this.customCountdown('start');
			}else{
				$this.data('state', COUNTDOWN_PAUSED);
			}
			
			//Callback For Pause
			opts.onPause.apply();
			
	 		debugTimeEnd('Pause');
		}
	};
	
	 //Copy Paste From jQuery's Plugin Documentation :)	
	 
	 try{
	 	 // Method calling logic
	     if ( methods[method] ) {
	       return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	     } else if ( typeof method === 'object' || ! method ) {
	       return methods.init.apply( this, arguments );       
	     } else {
	       $.error( 'Method ' +  method + ' does not exist' );
	     }
	 }catch(Exception){
		 
		 	 try{
				  if (window.console && window.console.log){
					  window.console.warn('==========Exception==========');
					  window.console.error(Exception);
					  window.console.info("Message : " + Exception.message);
					  window.console.info("File: " + Exception.fileName + ':' + Exception.lineNumber);
					  window.console.warn('==========Exception==========');
				  }
			  }
			  catch(err){
			 	  //ignore
			  }
	 }
  };
 //End Of Closure
})( jQuery );