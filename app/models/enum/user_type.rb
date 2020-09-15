class Enum::UserType < Enum::Base
  EMPLOYEE = self.new(1, :"従業員")
  ORGANIZATION_MANAGER = self.new(2, :"組織マネージャー")
  LOCATION_MANAGER = self.new(3, :"拠点マネージャー")
  BAN = self.new(4, :"アカウント停止")
end
