var moment = require('moment');

exports.join = function(channel) {
    // This will need to add to some non-volatile list
    jQuery("#channellist-content").append("<li id='" + channel + "'><span>#</span>" + channel + "</li>");
    jQuery("#channel-header").append(channel);
};

exports.add_message = function(from, message) {
    var last_poster = jQuery(".message-name:last").text();

    if (from == last_poster && appendable) {
        append_new_message(message);
    } else {
        post_new_message(from, message);
        reset_appendable();
    }
    updateScroll();
};

var appendable = 0;

function reset_appendable() {
    clearTimeout();
    appendable = 1
    setTimeout(function(){
        appendable = 0;
    }, 1000 * 180); // 3 minutes
}

function append_new_message(message) {
    var last_message = jQuery(".message:last");
    last_message.append("<div class='message-content'>" + message + "</div>");        
}

function post_new_message(from, message) {
    var now = moment().format('h:mm A');
    var channel_content = jQuery("#channel-content");
    channel_content.append(" \
    <div class='message'> \
        <span class='message-name'>" + from + "</span> \
        <span class='message-date'>" + now + "</span> \
        <div class='message-content'>" + message + "</div> \
    </div>");
}

// var scrolled = false;
function updateScroll(){
    jQuery('html,body').animate({ 
       scrollTop: jQuery(document).height()-jQuery(window).height()},
       300 // ms - time to scroll
    );
    // jQuery('html,body').scrollTop(jQuery(document).height()-jQuery(window).height())
}

// jQuery("html").bind('scroll', function(){
//     scrolled=true;
// });