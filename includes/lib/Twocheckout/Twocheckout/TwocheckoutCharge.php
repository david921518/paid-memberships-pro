<?php

class Twocheckout_Charge extends Twocheckout
{

    public static function form($params, $type='Checkout')
    {
        echo '<form id="2checkout" action="'.Twocheckout::$baseUrl.'/checkout/purchase" method="post">';

        foreach ($params as $key => $value)
        {
            echo '<input type="hidden" name="'.htmlspecialchars($key, ENT_QUOTES, 'UTF-8').'" value="'.htmlspecialchars($value, ENT_QUOTES, 'UTF-8').'"/>';
        }
        if ($type == 'auto') {
            echo '<input type="submit" value="' . esc_attr__( 'Click here if you are not redirected automatically.', 'paid-memberships-pro' ) . '" /></form>';
            echo '<script type="text/javascript">document.getElementById("2checkout").trigger("submit");</script>';
        } else {
            echo '<input type="submit" value="'.esc_attr($type).'" />';
            echo '</form>';
        }
    }

    public static function direct($params, $type='Checkout')
    {
        echo '<form id="2checkout" action="'.Twocheckout::$baseUrl.'/checkout/purchase" method="post">';

        foreach ($params as $key => $value)
        {
            echo '<input type="hidden" name="'.$key.'" value="'.esc_attr($value).'"/>';
        }

        if ($type == 'auto') {
            echo '<input type="submit" value="' . esc_attr__( 'Click here if the payment form does not open automatically.', 'paid-memberships-pro' ) . '" /></form>';
            echo '<script type="text/javascript">
                    function submitForm() {
                        document.getElementById("tco_lightbox").style.display = "block";
                        document.getElementById("2checkout").trigger("submit");
                    }
                    setTimeout("submitForm()", 2000);
                  </script>';
        } else {
            echo '<input type="submit" value="'.esc_attr($type).'" />';
            echo '</form>';
        }

        echo '<script src="'.Twocheckout::$baseUrl.'/static/checkout/javascript/direct.min.js"></script>';
    }

    public static function link($params)
    {
        $url = Twocheckout::$baseUrl.'/checkout/purchase?'.http_build_query($params, '', '&amp;');
        return $url;
    }

    public static function redirect($params)
    {
        $url = Twocheckout::$baseUrl.'/checkout/purchase?'.http_build_query($params, '', '&amp;');
        header("Location: $url");
    }

    public static function auth($params=array())
    {
        $params['api'] = 'checkout';
        $request = new Twocheckout_Api_Requester();
        $result = $request->doCall('/checkout/api/1/'.self::$sid.'/rs/authService', $params);
        return Twocheckout_Util::returnResponse($result);
    }

}
