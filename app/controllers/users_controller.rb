class UsersController < ApplicationController
  before_action :authenticate_user!
  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
    unless @user == current_user
      redirect_to :back, :alert => "Access denied."
    end
  end

  def num_of_closed_bids_with_user
    user = User.find(params[:user_id])
    unless user.role == "supplier"
      render_json_errors ['user closing bids must be driver']
    end
    bids = user.bids
    orders = Order.where(selected_bid: bids.pluck(:id))
    orders.count
  end

  protected

  def configure_devise_permitted_parameters
    registration_params = [:name, :email, :password, :password_confirmation, :role]
    devise_parameter_sanitizer.for(:sign_up) {
        |u| u.permit(registration_params)
    }
  end

end
