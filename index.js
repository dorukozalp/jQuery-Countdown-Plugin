/**
 * 
 */

$(function(){
    
    /*
     * 
     * COUNTDOWN PLUGIN 
     * 
     */
    
    var countdownOptions = {
    		debug: false
    	};
    
	$('#countdownStart').click(function(e){
		e.preventDefault();
		
		$(this).customCountdown(countdownOptions);
	});
	
	$('#countdownStop').click(function(e){
		e.preventDefault();
		
		$('#countdownStart').customCountdown('stop');
	});
	
	$('#countdownPause').click(function(e){
		e.preventDefault();
		
		$('#countdownStart').customCountdown('pause');
	});
	
	$('#countdownReset').click(function(e){
		e.preventDefault();
		
		$('#countdownStart').customCountdown('reset');
	});
	
	 /*
     * 
     * COUNTDOWN PLUGIN 
     * 
     */
});