class Enum::ShiftPrivateType < Enum::Base
  ORGANIZATION_PUBLIC = self.new(1, :"組織内なら誰でも閲覧可能")
  LOCATION_PUBLIC = self.new(2, :"拠点内なら誰でも閲覧可能")
  MANAGER_AND_SELF_ONLY = self.new(3, :"マネージャーと自分のみが閲覧可能")
end
