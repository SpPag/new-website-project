using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GuitarLessons.Domain.Entities;

namespace GuitarLessons.Infrastructure.Persistence
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (!context.Videos.Any())
            {
                context.Videos.AddRange(
                    new Video
                    {
                        Title = "Beginner Guitar Chords",
                        Description = "Learn the most important open chords for acoustic and electric guitar.",
                        Price = 19.99m,
                        StoragePath = "videos/beginner-chords.mp4",
                        PreviewUrl = "https://youtu.be/dummy1"
                    },
                    new Video
                    {
                        Title = "Pentatonic Soloing Secrets",
                        Description = "Master the pentatonic scale and play solos like a pro.",
                        Price = 29.99m,
                        StoragePath = "videos/pentatonic-solos.mp4",
                        PreviewUrl = "https://youtu.be/dummy2"
                    }
                );

                context.SaveChanges();
            }
        }
    }
}