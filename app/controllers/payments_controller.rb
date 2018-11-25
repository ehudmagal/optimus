class PaymentsController < ApplicationController
  before_action :authenticate_user!
  before_action :load_payment, only: [:show, :update]



  def show
    render json: @payment.as_json
  end

  def braintree_client_token
    render json: {token: braintree_handler.gateway.client_token.generate}
  end

  def create
    respond_to do |format|
      format.html {super}
      format.json {
        @payment = Payment.create(payment_params)
        render json: @payment.as_json
      }
    end
  end

  def update
    respond_to do |format|
      format.html {super}
      format.json {
        @payment.update!(bid_params)
        render json: @payment.as_json
      }
    end
  end

  private
  def payment_params
    params.require(:payment).permit(:order_id, :sum,:options)
  end

  def load_payment
    @payment = Payment.find(params[:id])
  end

  def braintree_handler
    @braintree_handler ||= BrainTreeHandler.new
  end


end
