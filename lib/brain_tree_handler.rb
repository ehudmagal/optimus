class BrainTreeHandler
  def gate_way
    @gateway ||= Braintree::Gateway.new(
        :environment => :sandbox,
        :merchant_id => CONF.braintree_merchant_id,
        :public_key => CONF.braintree_public_key,
        :private_key => CONF.braintree_public_key,
    )
  end


end