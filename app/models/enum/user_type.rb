class Enum::UserType < Enum::Base
  GUEST = self.new(1, :"お客様")
  STAFF = self.new(2, :"スタッフ")
  ADMIN = self.new(8, :"管理者")
  BAN = self.new(9, :"アカウント停止")
end
