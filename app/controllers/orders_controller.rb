class OrdersController < ApplicationController
  load_and_authorize_resource
  before_action :authenticate_user!, :except => [:show, :index]

  def index
    orders = Order.all
    if params.has_key?(:last_order_id)
      orders = orders.where('id > ?', params[:last_order_id])
    end
    render json: orders.map { |order| order.json_attributes }
  end

  def user_index
    orders = Order.where(user_id: current_user.id)
    if params.has_key?(:last_order_id)
      orders = orders.where('id > ?', params[:last_order_id])
    end
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
                     work_type: params['order']['work_type'],
                     options: prepare_options)
        render json: order
      }
    end
  end

  def prepare_options
    {box_types:  params['order']['box_types'],
     pallete_types: params['order']['pallet_types'],
    payment_method: params['order']['payment_method']}
  end

  def update
    respond_to do |format|
      format.html { super }
      format.json {
        begin
          @order = Order.find params['id']
          if approved_order_cancelled?(@order)
            email_cancel_participents(@order)
          end
          @order.update!(order_params)
          if @order.status == Order::STATUSES[:approved]
            email_participents @order
          end
        rescue => e
        end
        render json: @order
      }
    end
  end

  private
  def order_params
    params.require(:order).permit(:source, :destination, :weight, :goods_type, :work_type, :transport_type,
                                  :start_date, :end_date, :tons_per_hour, :deal_type, :fixed_price, :description,
                                  :contact_info, :pallets_count, :pallets_height, :pallets_length, :pallets_width,
                                  :pickup_cutoff_time, :pickup_time, :delivery_cutoff_time, :delivery_time,
                                  :distance, :selected_bid_id, :status,:box_types
    )
  end


  def email_participents order
    mailer = ExampleMailer.sample_email order.user, order
    mailer.deliver
    mailer = ExampleMailer.sample_email order.driver, order
    mailer.deliver
  end

  def email_cancel_participents order
    mailer = ExampleMailer.cancel_email order.user, order
    mailer.deliver
    mailer = ExampleMailer.cancel_email order.driver, order
    mailer.deliver
  end

  def approved_order_cancelled?(order)
    res = false
    if order.status == Order::STATUSES[:approved] && order_params[:status] == Order::STATUSES[:cancelled]
      res = true
    end
    res
  end


end
