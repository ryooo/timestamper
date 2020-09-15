class Enum::PaymentType < Enum::Base
  FREE = self.new(1, :"トライアル")
  PAID = self.new(2, :"課金")
end
