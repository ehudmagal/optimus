class UsersController < ApplicationController
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
    driver = Driver.find(params[:user_id])
    unless driver.is_a? Driver
      render_json_errors ['user closing bids must be driver']
    end
    orders = current_user.orders_closed_with_driver driver.id
    render json: orders.count
  end

  def login
    if loggedin?
      @user.save
      render json: @user.attributes
    else
      render json: {user: "#{params[:email]} not logged in"}
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      sign_in(@user)
      render json: {success: true}
    else
      render_json_errors  ['shalom']
    end
  end



  protected

  def loggedin?
    @user = User.find_by_email(user_params[:email])
    @user.valid_password?(user_params[:password]) unless @user.nil?
  end


  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :type)
  end

end
