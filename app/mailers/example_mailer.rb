class ExampleMailer < ActionMailer::Base
  default from: "ehudmagal@optimus.ninja"

  def sample_email(user)
    @user = user
    mail(to: @user.email, subject: 'Sample Email')
  end
end