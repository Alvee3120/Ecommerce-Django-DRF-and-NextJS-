"use client";

import { useState, type FormEvent } from "react";

import { StarPicker } from "@/components/product/star-picker";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitReview } from "@/lib/queries";
import type { ProductDetail } from "@/lib/types";

const STARS = [5, 4, 3, 2, 1] as const;

export function ProductReviews({
  product,
  onReviewSubmitted,
}: {
  product: ProductDetail;
  onReviewSubmitted: (updated: ProductDetail) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const submitReview = useSubmitReview(product.slug);

  const maxCount = Math.max(1, ...STARS.map((s) => product.rating_breakdown[String(s)] ?? 0));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!reviewerName.trim()) return;
    submitReview.mutate(
      { reviewer_name: reviewerName.trim(), rating, comment: comment.trim() },
      {
        onSuccess: (updated) => {
          onReviewSubmitted(updated);
          setOpen(false);
          setReviewerName("");
          setRating(5);
          setComment("");
        },
      }
    );
  }

  return (
    <section>
      <h2 className="relative mb-8 text-2xl font-medium after:absolute after:top-full after:left-0 after:mt-3 after:h-px after:w-16 after:bg-foreground/20">
        Reviews ({product.review_count})
      </h2>

      <div className="grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-semibold text-primary">
            {product.average_rating ?? "0.0"}
          </span>
          <div>
            <StarRating value={Number(product.average_rating ?? 0)} />
            <p className="mt-1 text-xs text-muted-foreground">{product.review_count} reviews</p>
          </div>
        </div>

        <div className="max-w-sm space-y-1.5">
          {STARS.map((star) => {
            const count = product.rating_breakdown[String(star)] ?? 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2">{star}</span>
                <span className="text-amber-400">★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-4 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button variant="default" size="lg" />
            }
          >
            {product.review_count === 0 ? "Be the first to review!" : "Write a review"}
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Write a review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Your rating</Label>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reviewer-name">Name</Label>
                <Input
                  id="reviewer-name"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="review-comment">Comment</Label>
                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitReview.isPending}>
                  {submitReview.isPending ? "Submitting..." : "Submit review"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 space-y-6 border-t pt-6">
        <h3 className="font-medium">Reviews</h3>
        {product.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">There are no reviews yet.</p>
        ) : (
          product.reviews.map((review) => (
            <div key={review.id} className="space-y-1 border-b pb-4 last:border-0">
              <div className="flex items-center gap-2">
                <StarRating value={review.rating} />
                <span className="font-medium">{review.reviewer_name}</span>
              </div>
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
              <p className="text-xs text-muted-foreground/70">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
