import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Relationship')
@Controller('api/v1/relationships')
export class RelationshipController {
  constructor(private relationshipService: RelationshipService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllRelationships() {
    return this.relationshipService.getAllRelationships();
  }

  @UseGuards(AuthGuard)
  @Get('recommended')
  getRecommendedRelationships(@Req() req: any) {
    return this.relationshipService.getRecommendedRelationships(
      req.user_data.id,
    );
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  getRelationshipsByUserId(@Param('id') id: string) {
    return this.relationshipService.getRelationshipsByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Get('my-friends')
  getMyFriends(@Req() req: any) {
    return this.relationshipService.getMyFriends(req.user_data.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getRelationshipById(@Param('id') id: string) {
    return this.relationshipService.getRelationshipById(id);
  }

  @UseGuards(AuthGuard)
  @Get('add-friend/:id')
  addFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.addFriend(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Get('accept-friend/:id')
  acceptFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.acceptFriend(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Get('cancel-friend/:id')
  cancelFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.cancelFriend(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Get('reject-friend/:id')
  rejectFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.rejectFriend(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Get('block-friend/:id')
  blockFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.blockFriend(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Get('unblock-friend/:id')
  unblockFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.unblockFriend(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Get('unfriend/:id')
  unfriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.unfriend(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Get('follow/:id')
  follow(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.follow(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Get('unfollow/:id')
  unfollow(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.unfollow(req.user_data.id, id);
  }
}
