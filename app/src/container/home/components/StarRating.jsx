import React from "react"
import { motion } from "framer-motion"
import { Star } from 'lucide-react'

export function StarRating({ rating, onRatingChange }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRatingChange(star)}
          className={`focus:outline-none ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          <Star className="w-8 h-8 fill-current" />
        </motion.button>
      ))}
    </div>
  )
}
