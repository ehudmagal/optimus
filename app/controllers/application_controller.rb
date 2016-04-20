require 'pry'

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  after_filter :set_csrf_cookie

  def set_csrf_cookie
    if protect_against_forgery?
      cookies.permanent['CSRF-TOKEN'] = form_authenticity_token
    end
  end

  def after_sign_in_path_for(resource)
    '/admin_gui'
  end



end
