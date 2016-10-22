class OrdersController < ApplicationController
  load_and_authorize_resource
  before_action :authenticate_user!, :except => [:show, :index]
  before_action :email_driver, :except => [:show, :index]
  def index
    @orders = Order.all
    render json: @orders.map { |order| order.json_attributes }
  end

  def user_index
    orders = Order.where(user_id: current_user.id)
    render json: orders.map { |order| order.json_attributes }
  end

  def show
    @order = Order.find(params[:id])
    render json: @order
  end

  def create
    respond_to do |format|
      format.html { super }
      format.json {
        order = Order.create(order_params)
        order.update(user_id: current_user.id,
                     source: params['order']['source'],
                     destination: params['order']['destination'],
                     work_type: params['order']['work_type'])
        render json: order
      }
    end
  end

  def update
    respond_to do |format|
      format.html { super }
      format.json {
        @order = Order.find params['id']
        @order.update!(order_params)
        render json: @order
      }
    end
  end

  private
  def order_params
    params.require(:order).permit(:source, :destination, :weight, :goods_type, :work_type, :transport_type,
                                  :start_date, :end_date, :tons_per_hour, :deal_type, :fixed_price, :description,
                                  :contact_info, :pallets_count, :pallets_height, :pallets_length, :pallets_width,
                                  :boxes_count, :boxes_height, :boxes_length, :boxes_width,
                                  :pickup_cutoff_time,:pickup_time,:delivery_cutoff_time,:delivery_time,
                                  :distance,:selected_bid_id,:status
    )
  end

  def email_driver
    binding.pry
    @order = Order.find_by(id: params[:id])
    if params[:order][:status] == Order::STATUSES[:approved] and !@order.nil?
      driver = @order.driver
      unless driver.nil?
        ExampleMailer.sample_email(driver).deliver
      end
    end
  end




end
