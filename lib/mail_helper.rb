require 'mailgun-ruby'

class MailHelper

  def email_approve_participents order
    user = order.user
    driver = order.driver
    mb_obj = Mailgun::MessageBuilder.new()
    mg_client = Mailgun::Client.new(ENV['MAILGUN_API_KEY'])
    mb_obj.from("service@optimus.website", {});
    mb_obj.add_recipient(:to, user.email, {"first" => user.name});
    mb_obj.add_recipient(:to, driver.email, {"first" => driver.name});
    mb_obj.subject("Optimus Order Approved #{user.name}");
    mb_obj.body_text("order #{order.id} has been approved.\n
          user: #{user.name}. driver: #{driver.name}\n
          Pickup Time:  #{Utils.convert_real_utc_to_local_utc(order.pickup_time,user.timezone)}\n
          Delivery Time:  #{Utils.convert_real_utc_to_local_utc(order.delivery_time,user.timezone)}\n
          Pickup Address:  #{order.source['address']}\n
          Delivery Address:  #{order.destination['address']}");
    mb_obj.message_id(nil)
    mg_client.send_message(ENV['MAILGUN_DOMAIN'], mb_obj)
  end
end
