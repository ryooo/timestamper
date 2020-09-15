module EnumMethodGenerator
  module ClassMethods
    def enum_methods(*enum_names)
      enum_names.each do |enum_name|
        # インスタンスメソッド定義
        self.class_eval(<<-EndMethods, __FILE__, __LINE__ + 1)
          def #{enum_name}
            @#{enum_name} ||= Object.const_get("Enum::#{enum_name.to_s.classify}").get_enum(self.#{enum_name}_id)
          end
        EndMethods
      end
    end
  end
  extend ActiveSupport::Concern
end
