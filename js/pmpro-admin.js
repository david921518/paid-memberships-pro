/**
 * Show a system prompt before redirecting to a URL.
 * Used for delete links/etc.
 * @param	text	The prompt, i.e. are you sure?
 * @param	url		The url to redirect to.
 */
 function pmpro_askfirst( text, url ) {
	var answer = window.confirm( text );

	if ( answer ) {
		window.location = url;
	}
}

/**
 * Deprecated in v2.1
 * In case add-ons/etc are expecting the non-prefixed version.
 */
if ( typeof askfirst !== 'function' ) {
    function askfirst( text, url ) {
        return pmpro_askfirst( text, url );
    }
}

/*
 * Toggle elements with a specific CSS class selector.
 * Used to hide/show sub settings when a main setting is enabled.
 * @since v2.1
 */
function pmpro_toggle_elements_by_selector( selector, checked ) {
	if( checked === undefined ) {
		jQuery( selector ).toggle();
	} else if ( checked ) {
		jQuery( selector ).show();
	} else {
		jQuery( selector ).hide();
	}
}

/*
 * Find inputs with a custom attribute pmpro_toggle_trigger_for,
 * and bind change to toggle the specified elements.
 * @since v2.1
 */
jQuery(document).ready(function() {
	jQuery( 'input[pmpro_toggle_trigger_for]' ).on( 'change', function() {
		pmpro_toggle_elements_by_selector( jQuery( this ).attr( 'pmpro_toggle_trigger_for' ), jQuery( this ).prop( 'checked' ) );
	});
});

/** JQuery to hide the notifications. */
jQuery(document).ready(function(){
	jQuery(document).on( 'click', '.pmpro-notice-button.notice-dismiss', function() {
		var notification_id = jQuery( this ).val();

		var postData = {
			action: 'pmpro_hide_notice',
			notification_id: notification_id
		}

		jQuery.ajax({
			type: "POST",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				///console.log( notification_id );
				jQuery('#'+notification_id).hide();
			}
		})
	
	});
});

/*
 * Create Webhook button for Stripe on the payment settings page.
 */
jQuery(document).ready(function() {
	// Check that we are on payment settings page.
	if ( ! jQuery( '#stripe_publishablekey' ).length || ! jQuery( '#stripe_secretkey' ).length || ! jQuery( '#pmpro_stripe_create_webhook' ).length ) {
		return;
	}

    // Disable the webhook buttons if the API keys aren't complete yet.
    jQuery('#stripe_publishablekey,#stripe_secretkey').on('change keyup', function() {
        pmpro_stripe_check_api_keys();
    });
	pmpro_stripe_check_api_keys();
    
    // AJAX call to create webhook.
	jQuery('#pmpro_stripe_create_webhook').on( 'click', function(event){
        event.preventDefault();
                
		var postData = {
			action: 'pmpro_stripe_create_webhook',
			secretkey: pmpro_stripe_get_secretkey(),
		}
		jQuery.ajax({
			type: "POST",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				response = jQuery.parseJSON( response );
                ///console.log( response );
                
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('error')
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('notice-success')
                
                if ( response.notice ) {
                    jQuery('#pmpro_stripe_webhook_notice').parent('div').addClass(response.notice);
                }
                if ( response.message ) {
                    jQuery('#pmpro_stripe_webhook_notice').html(response.message);
                }
                if ( response.success ) {
                    jQuery('#pmpro_stripe_create_webhook').hide();
                }
			}
		})
    });
    
    // AJAX call to delete webhook.
	jQuery('#pmpro_stripe_delete_webhook').on( 'click', function(event){
        event.preventDefault();
                
		var postData = {
			action: 'pmpro_stripe_delete_webhook',
			secretkey: pmpro_stripe_get_secretkey(),
		}

		jQuery.ajax({
			type: "POST",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				response = jQuery.parseJSON( response );
                ///console.log( response );
                
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('error')
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('notice-success')
                
                if ( response.notice ) {
                    jQuery('#pmpro_stripe_webhook_notice').parent('div').addClass(response.notice);
                }
                if ( response.message ) {
                    jQuery('#pmpro_stripe_webhook_notice').html(response.message);
                }
                if ( response.success ) {
                    jQuery('#pmpro_stripe_create_webhook').show();
                }				
			}
		})
	});

	// AJAX call to rebuild webhook.
	jQuery('#pmpro_stripe_rebuild_webhook').on( 'click', function(event){
        event.preventDefault();
                
		var postData = {
			action: 'pmpro_stripe_rebuild_webhook',
			secretkey: pmpro_stripe_get_secretkey(),
		}

		jQuery.ajax({
			type: "POST",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				response = jQuery.parseJSON( response );
                ///console.log( response );
                
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('error')
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('notice-success')
                
                if ( response.notice ) {
                    jQuery('#pmpro_stripe_webhook_notice').parent('div').addClass(response.notice);
                }
                if ( response.message ) {
                    jQuery('#pmpro_stripe_webhook_notice').html(response.message);
                }
                if ( response.success ) {
                    jQuery('#pmpro_stripe_create_webhook').hide();
                }				
			}
		})
    });
});

// Disable the webhook buttons if the API keys aren't complete yet.
function pmpro_stripe_check_api_keys() {  
    if( ( jQuery('#stripe_publishablekey').val().length > 0 && jQuery('#stripe_secretkey').val().length > 0 ) || jQuery('#live_stripe_connect_secretkey').val().length > 0 ) {
        jQuery('#pmpro_stripe_create_webhook').removeClass('disabled');
        jQuery('#pmpro_stripe_create_webhook').addClass('button-secondary');
    } else {            
        jQuery('#pmpro_stripe_create_webhook').removeClass('button-secondary');
        jQuery('#pmpro_stripe_create_webhook').addClass('disabled');
    }
}

function pmpro_stripe_get_secretkey() {
	if ( jQuery('#live_stripe_connect_secretkey').val().length > 0 && jQuery( "select[name='gateway_environment']" ).val() === 'live' ) {
		return jQuery('#live_stripe_connect_secretkey').val();
	} else if ( jQuery('#test_stripe_connect_secretkey').val().length > 0 && jQuery( "select[name='gateway_environment']" ).val() === 'sandbox' ) {
		return jQuery('#test_stripe_connect_secretkey').val();
	} else if ( jQuery('#stripe_secretkey').val().length > 0 ) {
		return jQuery('#stripe_secretkey').val();
	} else {
		return '';
	}
}

// EMAIL TEMPLATES.
jQuery(document).ready(function($) {
    
	/* Variables */
	var template, disabled, $subject, $editor, $testemail;
	$subject = $("#email_template_subject").closest("tr");
	$editor = $("#wp-email_template_body-wrap");
	$testemail = $("#test_email_address").closest("tr");
	
    $(".hide-while-loading").hide();
    $(".controls").hide();
    $(".striped tr:even").css('background-color','#efefef');

    /* PMPro Email Template Switcher */
    $("#pmpro_email_template_switcher").change(function() {
        
        $(".status_message").hide();
        template = $(this).val();
        
        //get template data
        if (template)
            getTemplate(template);
        else {
            $(".hide-while-loading").hide();
            $(".controls").hide();
        }
    });

    $("#submit_template_data").click(function() {
        saveTemplate()
    });

    $("#reset_template_data").click(function() {
        resetTemplate();
    });

    $("#email_template_disable").click(function(e) {
        disableTemplate();
    });

    $("#send_test_email").click(function(e) {       
		saveTemplate().done(setTimeout(function(){sendTestEmail();}, '1000'));
    });

    /* Functions */
    function getTemplate(template) {        
				
		//hide stuff and show ajax spinner
        $(".hide-while-loading").hide();
        $("#pmproet-spinner").show();

        //get template data
        $data = {
            template: template,
            action: 'pmpro_email_templates_get_template_data',
            security: $('input[name=security]').val()
        };

    //    console.log( $data );

        $.post(ajaxurl, $data, function(response) {
            var template_data = JSON.parse(response);

            //show/hide stuff
			$("#pmproet-spinner").hide();
            $(".controls").show();
            $(".hide-while-loading").show();
            $(".status").hide();

            //change disable text
            if (template == 'header' || template === 'footer') {

                $subject.hide();
				$testemail.hide();
				
                if(template == 'header')
                    $("#disable_label").text("Disable email header for all PMPro emails?");
                else
                    $("#disable_label").text("Disable email footer for all PMPro emails?");

                //hide description
                $("#disable_description").hide();
            }
            else {
                $testemail.show();
				$("#disable_label").text("Disable this email?");
                $("#disable_description").show().text("PMPro emails with this template will not be sent.");
            }

            // populate subject and body
			$('#email_template_subject').val(template_data['subject']);
			$('#email_template_body').val(template_data['body']);

            // disable form
            disabled = template_data['disabled'];
            toggleFormDisabled(disabled);
        });
    }

    function saveTemplate() {

//        $(".controls").hide();
        $("#submit_template_data").attr("disabled", true);
        $(".status").hide();
        // console.log(template);

        $data = {
            template: template,
            subject: $("#email_template_subject").val(),
            body: $("#email_template_body").val(),
            action: 'pmpro_email_templates_save_template_data',
            security: $('input[name=security]').val()
        };
        $.post(ajaxurl, $data, function(response) {
            if(response != 0) {
                $("#message").addClass('updated');
            }
            else {
                $("#message").addClass("error");
            }
            $("#submit_template_data").attr("disabled", false);
            $(".status_message").html(response);
            $(".status").show();
            $(".status_message").show();
        });

		return $.Deferred().resolve();
    }

    function resetTemplate() {

        var r = confirm('Are you sure? Your current template settings will be deleted permanently.');

        if(!r) return false;

        $data = {
            template: template,
            action: 'pmpro_email_templates_reset_template_data',
            security: $('input[name=security]').val()
        };
        $.post(ajaxurl, $data, function(response) {
            var template_data = $.parseJSON(response);
            $('#email_template_subject').val(template_data['subject']);
            $('#email_template_body').val(template_data['body']);
        });

        return true;
    }

    function disableTemplate() {

        //update wp_options
        data = {
            template: template,
            action: 'pmpro_email_templates_disable_template',
            disabled: $("#email_template_disable").is(":checked"),
            security: $('input[name=security]').val()
        };

        $.post(ajaxurl, data, function(response) {

            response = JSON.parse(response);

            //failure
            if(response['result'] == false) {
                $("#message").addClass("error");
                $(".status_message").show().text("There was an error updating your template settings.");
            }
            else {
                if(response['status'] == 'true') {
                    $("#message").addClass("updated");
                    $(".status_message").show().text("Template Disabled");
                }
                else {
                    $("#message").addClass("updated");
                    $(".status_message").show().text("Template Enabled");
                }
            }

            $(".hide-while-loading").show();

            disabled = response['status'];

            toggleFormDisabled(disabled);
        });
    }

    function sendTestEmail() {

        //hide stuff and show ajax spinner
        $(".hide-while-loading").hide();
        $("#pmproet-spinner").show();

        data = {
            template: template,
            email: $("#test_email_address").val(),			
            action: 'pmpro_email_templates_send_test',
            security: $('input[name=security]').val()
        };

        $.post(ajaxurl, data, function(success) {
            //show/hide stuff
            $("#pmproet-spinner").hide();
            $(".controls").show();
            $(".hide-while-loading").show();

            if(success) {
                $("#message").addClass("updated").removeClass("error");
                $(".status_message").show().text("Test e-mail sent successfully.");
            }
            else {
                $("#message").addClass("error").removeClass("updated");
                $(".status_message").show().text("Test e-mail failed.");
            }

        })
    }

    function toggleFormDisabled(disabled) {

        if(disabled == 'true') {
            $("#email_template_disable").attr('checked', true);
            $("#email_template_body").attr('readonly', 'readonly').attr('disabled', 'disabled');
            $("#email_template_subject").attr('readonly', 'readonly').attr('disabled', 'disabled');
            $(".controls").hide();
        }
        else {
            $("#email_template_disable").attr('checked', false);
            $("#email_template_body").removeAttr('readonly','readonly').removeAttr('disabled', 'disabled');
            $("#email_template_subject").removeAttr('readonly','readonly').removeAttr('disabled', 'disabled');
            $(".controls").show();
        }

    }

});
