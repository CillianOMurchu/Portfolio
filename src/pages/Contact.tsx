import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Chatbot Container */}
        <div className="bg-slate-950/50 backdrop-blur-md border-2 border-accent-subtle rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          {/* <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border-b border-emerald-500/30 px-6 py-4"> */}
          {/* <h2 className="text-emerald-400 font-semibold text-lg">Let's Connect</h2> */}
          {/* </div> */}

          {/* Chat Content */}
          <div className="p-8 space-y-6">
            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-start"
            >
              <div className="bg-accent-subtle border border-accent-subtle rounded-lg px-5 py-3 max-w-xs">
                <p className="text-accent text-base leading-relaxed">
                  Hello there 👋
                </p>
              </div>
            </motion.div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-3 pt-4"
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-accent-subtle rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent-subtle transition-all"
              />
              <button className="w-full px-4 py-3 bg-accent/80 hover:bg-accent text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20">
                Send
              </button>
            </motion.div>
          </div>

          {/* Footer Info */}
          <div className="self-end bg-slate-900/50 border-t border-accent-subtle px-6 py-3 text-center">
            <p className="text-gray-500 text-xs">
              💬 Let's chat about projects, ideas, or opportunities
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
