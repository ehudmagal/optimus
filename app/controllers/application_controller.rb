require 'pry'

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  after_filter :set_csrf_cookie
  after_filter :set_cookie_params_user
  respond_to :html, :json
  def set_csrf_cookie
    if protect_against_forgery?
      cookies.permanent['CSRF-TOKEN'] = form_authenticity_token
    end
  end
  def set_cookie_params_user
    if user_signed_in?
      cookies[:user_name] = current_user.name
      cookies[:user_email] = current_user.email
      cookies[:user_role] = current_user.role
    else
      cookies[:user_name] = nil
      cookies[:user_email] = nil
    end

  end




end
