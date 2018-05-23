class ExampleMailer < ActionMailer::Base
  default from: "ehudmagal@gmail.com"

  def sample_email(user,order)
    @order = order
    @user = user
    mail(to: @user.email, subject: 'Optimus Order Status')
  end

  def cancel_email(user,order)
    @order = order
    @user = user
    mail(to: @user.email, subject: 'Optimus Order Status')
  end
end