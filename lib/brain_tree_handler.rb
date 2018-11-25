class BrainTreeHandler
  def gateway
    @gateway ||= Braintree::Gateway.new(
        :environment =>  (ENV["BRAINTREE_ENV"] || 'sandbox').to_sym,
        :merchant_id => ENV['BRAINTREE_MERCHANT_ID'],
        :public_key =>  ENV['BRAINTREE_PUBLIC_KEY'],
        :private_key => ENV['BRAINTREE_PRIVATE_KEY'],
    )
  end


end