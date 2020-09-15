module TaskLogging
  def task(*args, &block)
    Rake::Task.define_task(*args) do |task, task_args|
      if block_given?
        default_logger = Rails.logger
        begin
          Rails.logger = Logger.new(Rails.root.join("log/#{task.name}.log"), 'daily')
          Rails.logger.info(task.name_with_args)
          Rails.logger.info(puts "#{task.name_with_args} - start.")
          block.call(task, task_args)
          Rails.logger.info(puts "#{task.name_with_args} - finish.")
        rescue => e
          Rails.logger.info(puts "#{task.name_with_args} - fail. \n#{e.message}\n" + %!#{e.backtrace.join("\n")}!)
          raise e
        ensure
          Rails.logger = default_logger
        end
      end
    end
  end
end

# Override Rake::DSL#task to inject logging
extend TaskLogging
