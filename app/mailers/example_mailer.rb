class ExampleMailer < ActionMailer::Base
  default from: "ehudmagal@gmail.com"

  def sample_email(user)
    @user = user
    mail(to: @user.email, subject: 'Sample Email')
  end
end